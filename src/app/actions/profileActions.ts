'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function getOwnerProfile(businessId?: string) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { name: true, email: true, phone: true, profileImage: true, id: true }
        })

        const businesses = await prisma.business.findMany({
            where: { ownerId: session.userId, status: { not: 'DELETED' } }
        })
        
        const business = businessId 
            ? businesses.find(b => b.id === businessId) 
            : businesses[0]

        return { success: true, user, business, businesses }
    } catch (err) {
        return { error: 'Failed' }
    }
}

export async function updateOwnerProfile(formData: FormData) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }

    const name = formData.get('userName') as string
    const phone = formData.get('userPhone') as string
    let profileImage = formData.get('profileImage') as string
    
    const businessId = formData.get('businessId') as string
    const businessName = formData.get('businessName') as string
    const businessDescription = formData.get('businessDescription') as string
    const website = formData.get('website') as string
    let businessLogo = formData.get('businessLogo') as string

    const profileFile = formData.get('profileImageFile') as File | null
    const logoFile = formData.get('businessLogoFile') as File | null

    try {
        const uploadDir = path.join(process.cwd(), 'public/uploads')
        await mkdir(uploadDir, { recursive: true }).catch(() => {})

        if (profileFile && profileFile.size > 0) {
            const bytes = await profileFile.arrayBuffer()
            const ext = path.extname(profileFile.name) || '.jpg'
            const filename = `owner_avatar_${session.userId}_${Date.now()}${ext}`
            await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
            profileImage = `/uploads/${filename}`
        }

        if (logoFile && logoFile.size > 0) {
            const bytes = await logoFile.arrayBuffer()
            const ext = path.extname(logoFile.name) || '.png'
            const filename = `business_logo_${businessId}_${Date.now()}${ext}`
            await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
            businessLogo = `/uploads/${filename}`
        }

        await prisma.user.update({
            where: { id: session.userId },
            data: { name, phone, profileImage }
        })

        if (businessId) {
            await prisma.business.update({
                where: { id: businessId },
                data: { name: businessName, description: businessDescription, website, businessLogo }
            })
        }

        return { success: true }
    } catch (err) {
        return { error: 'Failed to update profile' }
    }
}

export async function getCustomerProfile() {
    const session = await getSession()
    if (!session || session.role !== 'CUSTOMER') return { error: 'Unauthorized' }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { name: true, email: true, phone: true, profileImage: true, id: true }
        })
        return { success: true, user }
    } catch (err) {
        return { error: 'Failed' }
    }
}

export async function updateCustomerProfile(formData: FormData) {
    const session = await getSession()
    if (!session || session.role !== 'CUSTOMER') return { error: 'Unauthorized' }

    const name = formData.get('userName') as string
    const phone = formData.get('userPhone') as string
    let profileImage = formData.get('profileImage') as string

    const file = formData.get('profileImageFile') as File | null

    try {
        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            
            const uploadDir = path.join(process.cwd(), 'public/uploads')
            await mkdir(uploadDir, { recursive: true }).catch(() => {})
            
            const ext = path.extname(file.name) || '.jpg'
            const filename = `avatar_${session.userId}_${Date.now()}${ext}`
            const filepath = path.join(uploadDir, filename)
            
            await writeFile(filepath, buffer)
            profileImage = `/uploads/${filename}`
        }

        await prisma.user.update({
            where: { id: session.userId },
            data: { name, phone, profileImage }
        })
        return { success: true }
    } catch (err) {
        return { error: 'Failed to update user profile' }
    }
}
