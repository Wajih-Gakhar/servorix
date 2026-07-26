'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createNotification } from '@/app/actions/notificationActions'

export async function createBusiness(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'OWNER') {
    return { error: 'Unauthorized: Only owners can create a business' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const phone = formData.get('phone') as string
  const type = formData.get('type') as string // SALON, GYM
  const category = formData.get('category') as string 
  const openingTime = formData.get('openingTime') as string
  const closingTime = formData.get('closingTime') as string

  if (!name || !address || !city || !type || !category || !openingTime || !closingTime) {
    return { error: 'Please provide all required fields' }
  }

  try {
    const business = await prisma.business.create({
      data: {
        ownerId: session.userId as string,
        name,
        description: description || '',
        address,
        city,
        phone: phone || '',
        type,
        category,
        openingTime,
        closingTime,
        status: 'PENDING'
      }
    })
    return { success: true, businessId: business.id }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to create business' }
  }
}

export async function updateBusinessStatus(businessId: string, status: 'APPROVED' | 'REJECTED' | 'CLOSURE_REQUESTED' | 'DELETED' | 'SUSPENDED') {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized: Only admins can perform this action' }
  }

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: { status }
    })

    await createNotification(
      business.ownerId,
      'Business Status Update',
      `Your business ${business.name} has been marked as ${status}.`,
      'SYSTEM'
    )

    return { success: true, business }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to update business status' }
  }
}

export async function requestBusinessClosure(businessId: string) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }

    try {
        const business = await prisma.business.findUnique({ where: { id: businessId } })
        if (!business || business.ownerId !== session.userId) return { error: 'Action denied.' }

        await prisma.business.update({
             where: { id: businessId },
             data: { status: 'CLOSURE_REQUESTED' }
        })
        return { success: true }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to request closure' }
    }
}

export async function cancelClosureRequest(businessId: string) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }

    try {
        const business = await prisma.business.findUnique({ where: { id: businessId } })
        if (!business || business.ownerId !== session.userId) return { error: 'Action denied.' }

        await prisma.business.update({
             where: { id: businessId },
             data: { status: 'APPROVED' }
        })
        return { success: true }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to cancel closure' }
    }
}

export async function getBusinesses(filters?: { 
  city?: string; 
  type?: string; 
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'newest' | 'price_low' | 'price_high'
}) {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        status: 'APPROVED',
        ...(filters?.city && { city: filters.city }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.query && {
          OR: [
            { name: { contains: filters.query } },
            { description: { contains: filters.query } },
            { services: { some: { name: { contains: filters.query } } } }
          ]
        }),
        ...( (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) && {
          services: {
             some: {
                ...(filters.minPrice !== undefined && { price: { gte: filters.minPrice } }),
                ...(filters.maxPrice !== undefined && { price: { lte: filters.maxPrice } })
             }
          }
        })
      },
      include: {
        services: true,
        reviews: true
      }
    })
    
    // In-memory Ranking Engine
    let ranked = businesses.map(b => {
        const avgRating = b.reviews.length ? (b.reviews.reduce((a, r) => a + r.rating, 0) / b.reviews.length) : 0;
        
        let exactMatchScore = 0;
        if (filters?.query) {
            const q = filters.query.toLowerCase();
            if (b.name.toLowerCase() === q) exactMatchScore += 100;
            else if (b.name.toLowerCase().includes(q)) exactMatchScore += 50;
        }
        
        const basePrice = b.services.length ? Math.min(...b.services.map(s => s.price)) : 999999;
        
        return {
            ...b,
            avgRating,
            basePrice,
            score: avgRating * 10 + exactMatchScore
        }
    })
    
    // Rating Constraint Filter
    if (filters?.minRating !== undefined) {
        ranked = ranked.filter(b => b.avgRating >= filters!.minRating!);
    }
    
    // Global Sort Map
    ranked.sort((a, b) => {
        if (filters?.sortBy === 'price_low') return a.basePrice - b.basePrice;
        if (filters?.sortBy === 'price_high') return b.basePrice - a.basePrice;
        
        // Default Rank Sort System
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })

    return { success: true, businesses: ranked }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to fetch businesses via algorithm' }
  }
}

export async function getBusinessById(id: string) {
  try {
    const business = await prisma.business.findUnique({
      where: { id, status: 'APPROVED' },
      include: {
        services: true,
        workingHours: true,
        reviews: {
          include: { customer: { select: { name: true, profileImage: true } } }
        }
      }
    })
    if (!business) return { error: 'Business not found' }
    return { success: true, business }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to fetch business' }
  }
}
