'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function createReview(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'CUSTOMER') {
    return { error: 'Unauthorized: Only customers can leave reviews' }
  }

  const businessId = formData.get('businessId') as string
  const rating = parseInt(formData.get('rating') as string, 10)
  const comment = formData.get('comment') as string

  if (!businessId || isNaN(rating) || rating < 1 || rating > 5) {
    return { error: 'Invalid review data' }
  }

  try {
    // Optional check: Did user book a completed appointment with the business?
    const hasCompletedBooking = await prisma.appointment.findFirst({
      where: {
        customerId: session.userId,
        businessId,
        status: 'COMPLETED'
      }
    })

    if (!hasCompletedBooking) {
      return { error: 'You must have a completed appointment to leave a review' }
    }

    const review = await prisma.review.create({
      data: {
        customerId: session.userId as string,
        businessId,
        rating,
        comment: comment || null
      }
    })

    return { success: true, review }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to submit review' }
  }
}
