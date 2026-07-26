'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function createService(businessId: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'OWNER') {
    return { error: 'Unauthorized: Only owners can create services' }
  }

  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const duration = parseInt(formData.get('duration') as string, 10)

  if (!name || isNaN(price) || isNaN(duration)) {
    return { error: 'Invalid service details' }
  }

  // Verify the business belongs to the owner
  const business = await prisma.business.findUnique({ where: { id: businessId } })
  if (!business || business.ownerId !== session.userId) {
    return { error: 'Unauthorized to add service to this business' }
  }

  try {
    const service = await prisma.service.create({
      data: { businessId, name, price, duration }
    })
    return { success: true, service }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to create service' }
  }
}

export async function deleteService(serviceId: string) {
  const session = await getSession()
  if (!session || session.role !== 'OWNER') {
    return { error: 'Unauthorized' }
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { business: true }
    })
    
    if (!service || service.business.ownerId !== session.userId) {
      return { error: 'Unauthorized or service not found' }
    }

    await prisma.service.delete({ where: { id: serviceId } })
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to delete service' }
  }
}
