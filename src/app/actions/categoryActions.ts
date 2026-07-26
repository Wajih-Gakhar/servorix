'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function createCategory(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const icon = formData.get('icon') as string

  if (!name) return { error: 'Category name is required' }

  try {
    const existing = await prisma.category.findUnique({ where: { name } })
    if (existing) {
      return { error: 'Category with this name already exists' }
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        icon: icon || null
      }
    })

    return { success: true, category }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to create category' }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    return { success: true, categories }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to fetch categories' }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const icon = formData.get('icon') as string

  if (!name) return { error: 'Category name is required' }

  try {
    const existing = await prisma.category.findFirst({ 
      where: { 
        name,
        id: { not: id }
      } 
    })
    if (existing) {
      return { error: 'Category with this name already exists' }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || null,
        icon: icon || null
      }
    })

    return { success: true, category }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.category.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to delete category' }
  }
}

export async function seedMissingCategories() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const PREDEFINED_CATEGORIES = [
    { name: 'Barbershop', icon: '💈', description: 'Precision cuts' },
    { name: 'Hair Salon', icon: '✂️', description: 'Styling & color' },
    { name: 'Spa & Massage', icon: '💆‍♀️', description: 'Relaxation' },
    { name: 'Nail Studio', icon: '💅', description: 'Manicures & Pedicures' },
    { name: 'CrossFit', icon: '🏋️‍♂️', description: 'Functional training' },
    { name: 'Yoga Studio', icon: '🧘‍♀️', description: 'Core & mindfulness' },
    { name: 'Boxing', icon: '🥊', description: 'Combat sports' },
    { name: 'Personal Training', icon: '💪', description: 'Performance coaching' },
  ]

  try {
    const existing = await prisma.category.findMany()
    const existingNames = new Set(existing.map(c => c.name.toLowerCase()))
    
    const toCreate = PREDEFINED_CATEGORIES.filter(c => !existingNames.has(c.name.toLowerCase()))
    
    if (toCreate.length === 0) return { success: true, message: 'Already seeded' }

    await Promise.all(toCreate.map(c => prisma.category.create({ data: c })))
    
    return { success: true, count: toCreate.length }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to seed categories' }
  }
}
