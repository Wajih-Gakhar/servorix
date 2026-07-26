'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createNotification } from './notificationActions'

export async function createBooking(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized: Please log in to book' }
  if (session.role === 'ADMIN') return { error: 'Admins cannot book appointments' }

  const businessId = formData.get('businessId') as string
  const serviceId = formData.get('serviceId') as string
  const date = formData.get('date') as string
  const startTime = formData.get('startTime') as string

  if (!businessId || !serviceId || !date || !startTime) {
    return { error: 'Missing required booking details' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check for double booking
      const existingBooking = await tx.appointment.findFirst({
          where: { businessId, date, startTime, status: { notIn: ['CANCELLED', 'REJECTED'] } }
      })
      if (existingBooking) throw new Error('Time slot is already booked')

      const usePoints = formData.get('usePoints') === 'on'

      const service = await tx.service.findUnique({ where: { id: serviceId } })
      if (!service) throw new Error('Service invalid')

      let discount = 0
      if (usePoints) {
          // Validate they have enough points
          const pointsRecords = await tx.loyaltyPoints.findMany({ where: { userId: session.userId as string } })
          const totalPoints = pointsRecords.reduce((acc, row) => acc + row.points, 0)
          if (totalPoints >= 50) {
              discount = 5 // $5 off
              // Deduct points
              await tx.loyaltyPoints.create({
                  data: {
                      userId: session.userId as string,
                      points: -50
                  }
              })
          }
      }

      const paymentType = formData.get('paymentType') as string || 'FULL'
      const paymentMethodRaw = formData.get('paymentMethod') as string || 'CARD'
      let amount = Math.max(0, service.price - discount)
      if (paymentType === 'DEPOSIT') {
          amount = service.price * 0.20 // 20% deposit
      }

      const platformFee = amount * 0.05
      const ownerAmount = amount - platformFee

      const booking = await tx.appointment.create({
        data: {
          customerId: session.userId as string,
          businessId,
          serviceId,
          date,
          startTime,
          status: 'PENDING'
        },
        include: { business: true, service: true }
      })

      // Create Payment Record
      await tx.payment.create({
          data: {
              bookingId: booking.id,
              businessId,
              userId: session.userId as string,
              amount,
              platformFee,
              ownerAmount,
              paymentMethod: paymentType === 'PAY_ON_VISIT' ? 'CASH' : paymentMethodRaw,
              paymentType,
              status: paymentType === 'PAY_ON_VISIT' ? 'PENDING' : 'COMPLETED'
          }
      })

      return booking;
    }, {
      isolationLevel: 'Serializable', // Prevent phantom reads and race conditions
      maxWait: 5000,
      timeout: 10000
    });

    // Notify owner
    await createNotification(result.business.ownerId, 'New Booking Request', `New booking request for ${result.service.name} on ${date} at ${startTime}.`, 'SYSTEM')
    // Notify customer
    await createNotification(session.userId as string, 'Booking Created', `Your request for ${result.service.name} is pending approval.`, 'SYSTEM')

    // BROADCAST ROOM: Lock slot for all active viewers
    await fetch('http://localhost:3000/api/socket/internal-broadcast', {
        method: 'POST',
        body: JSON.stringify({
            room: `business_${result.businessId}`,
            type: 'SLOT_BOOKED',
            date: date,
            startTime: startTime
        })
    }).catch(err => console.error('Broadcast failed:', err))

    return { success: true, booking: result }
  } catch (err: any) {
    console.error(err)
    return { error: err.message || 'Failed to create booking' }
  }
}

export async function getCustomerBookings() {
  const session = await getSession()
  if (!session || session.role !== 'CUSTOMER') return { error: 'Unauthorized' }

  try {
    const bookings = await prisma.appointment.findMany({
      where: { customerId: session.userId },
      include: {
        business: { select: { name: true, address: true, city: true } },
        service: { select: { name: true, price: true, duration: true } }
      },
      orderBy: { date: 'desc' }
    })
    return { success: true, bookings }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to fetch bookings' }
  }
}

export async function getOwnerBookings() {
  const session = await getSession()
  if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }

  try {
    // An owner could have multiple businesses in the DB schema
    const businesses = await prisma.business.findMany({
      where: { ownerId: session.userId },
      select: { id: true }
    });
    
    if (!businesses.length) return { success: true, bookings: [] };

    const businessIds = businesses.map(b => b.id);
    
    const bookings = await prisma.appointment.findMany({
      where: { businessId: { in: businessIds } },
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        service: { select: { name: true, price: true, duration: true } }
      },
      orderBy: { date: 'asc' } // Earliest first
    })
    return { success: true, bookings }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to fetch bookings' }
  }
}

export async function updateBookingStatus(bookingId: string, status: 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED') {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  try {
    const booking = await prisma.appointment.findUnique({
      where: { id: bookingId },
      include: { business: true }
    })

    if (!booking) return { error: 'Booking not found' }

    // Customer can only cancel
    if (session.role === 'CUSTOMER') {
      if (booking.customerId !== session.userId || status !== 'CANCELLED') {
        return { error: 'Unauthorized action' }
      }
    } 
    // Owner can approve/reject/complete/cancel
    else if (session.role === 'OWNER') {
      if (booking.business.ownerId !== session.userId) {
        return { error: 'Unauthorized action' }
      }
    } else {
      return { error: 'Admins cannot update booking status directly' }
    }

    const updatedBooking = await prisma.appointment.update({
      where: { id: bookingId },
      data: { status },
      include: { service: true }
    })

    // Loyalty Points (if completed)
    if (status === 'COMPLETED') {
       await prisma.loyaltyPoints.create({
          data: {
             userId: updatedBooking.customerId,
             points: 10
          }
       })
    }

    // Notifications
    if (status === 'APPROVED' || status === 'REJECTED' || status === 'CANCELLED' || status === 'COMPLETED') {
        const message = status === 'APPROVED' ? `Your booking for ${updatedBooking.service.name} has been approved.` :
                       status === 'REJECTED' ? `Your booking for ${updatedBooking.service.name} was rejected.` :
                       status === 'COMPLETED' ? `Your appointment for ${updatedBooking.service.name} is complete!` :
                       `A booking for ${updatedBooking.service.name} has been cancelled.`;
                       
        // Notify Customer if owner took action, or notify Owner if customer cancelled
        if (session.role === 'OWNER') {
            await createNotification(updatedBooking.customerId, `Booking ${status}`, message, 'SYSTEM')
        } else if (session.role === 'CUSTOMER') {
            await createNotification(booking.business.ownerId, `Booking Cancelled`, `The booking on ${updatedBooking.date} at ${updatedBooking.startTime} was cancelled by the customer.`, 'SYSTEM')
        }
    }

    return { success: true, booking: updatedBooking }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to update booking status' }
  }
}

export async function getAvailableSlots(businessId: string, serviceId: string, dateString: string) {
    try {
        const service = await prisma.service.findUnique({ where: { id: serviceId } })
        if (!service) return { error: 'Service not found' }

        // Avoid UTC timezone drift by directly splitting the local date string
        const [year, month, day] = dateString.split('-').map(Number)
        const dateObj = new Date(year, month - 1, day)
        const dayOfWeek = dateObj.getDay() 

        let workingHours = await prisma.workingHours.findFirst({
            where: { businessId, dayOfWeek }
        })

        // Check if business has ANY custom hours configured
        const totalConfigured = await prisma.workingHours.count({ where: { businessId } })

        // Fallback to global business hours ONLY if zero custom hours have ever been saved
        if (!workingHours && totalConfigured === 0) {
            const business = await prisma.business.findUnique({ where: { id: businessId } })
            if (business && business.openingTime && business.closingTime) {
                workingHours = {
                    id: 'fallback',
                    businessId,
                    dayOfWeek,
                    openTime: business.openingTime,
                    closeTime: business.closingTime
                }
            }
        }

        if (!workingHours) return { success: true, slots: [] } // Closed on this day

        const existingBookings = await prisma.appointment.findMany({
            where: { businessId, date: dateString, status: { notIn: ['CANCELLED', 'REJECTED'] } }
        })

        const slots: { time: string, isBooked: boolean }[] = []
        const [openHour, openMin] = workingHours.openTime.split(':').map(Number)
        const [closeHour, closeMin] = workingHours.closeTime.split(':').map(Number)
        
        const openTimeMins = openHour * 60 + openMin
        const closeTimeMins = closeHour * 60 + closeMin
        
        let currentTimeMins = openTimeMins
        const duration = service.duration // duration in minutes

        while (currentTimeMins + duration <= closeTimeMins) {
            const h = Math.floor(currentTimeMins / 60)
            const m = currentTimeMins % 60
            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
            
            // Check if there is an overlapping appointment
            const isBooked = existingBookings.some(b => {
                const [bh, bm] = b.startTime.split(':').map(Number)
                const bookingStart = bh * 60 + bm
                // Assuming all services take approx their duration or for simplicity just matching start time.
                // A better approach is checking overlap if we had end times. 
                // Let's assume an appointment fully blocks the duration.
                const bookingEnd = bookingStart + duration // Simplified: uses requested service duration as blocked duration
                
                // Overlap condition:
                // New slot: [currentTimeMins, currentTimeMins + duration]
                // Existing: [bookingStart, bookingEnd]
                return currentTimeMins < bookingEnd && currentTimeMins + duration > bookingStart
            })

            slots.push({ time: timeString, isBooked })

            // Step by 30 minutes
            currentTimeMins += 30 
        }

        return { success: true, slots }
    } catch (err) {
         console.error(err)
         return { error: 'Failed to generate slots' }
    }
}
