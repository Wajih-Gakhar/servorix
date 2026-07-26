'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function getWorkingHours(businessId: string) {
    try {
        const hours = await prisma.workingHours.findMany({
            where: { businessId },
            orderBy: { dayOfWeek: 'asc' }
        })
        const hasConfiguredHours = hours.length > 0
        return { success: true, hours, hasConfiguredHours }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to fetch working hours' }
    }
}

export type DaySchedule = {
    dayOfWeek: number
    isOpen: boolean
    openTime: string
    closeTime: string
}

export async function updateWorkingHours(businessId: string, schedules: DaySchedule[]) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }

    // Verify ownership
    const business = await prisma.business.findUnique({ where: { id: businessId } })
    if (!business || business.ownerId !== session.userId) {
        return { error: 'Unauthorized action' }
    }

    try {
        // Delete all existing hours for this business
        await prisma.workingHours.deleteMany({
            where: { businessId }
        })

        // Insert new schedules (only the ones marked as isOpen)
        const openDays = schedules.filter(s => s.isOpen)
        if (openDays.length > 0) {
            await prisma.workingHours.createMany({
                data: openDays.map(s => ({
                    businessId,
                    dayOfWeek: s.dayOfWeek,
                    openTime: s.openTime,
                    closeTime: s.closeTime
                }))
            })
        }

        return { success: true }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to update working hours' }
    }
}
