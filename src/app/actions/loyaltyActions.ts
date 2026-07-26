'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function getCustomerLoyaltyPoints() {
    const session = await getSession()
    if (!session || session.role !== 'CUSTOMER') return { error: 'Unauthorized' }

    try {
        const pointsRecords = await prisma.loyaltyPoints.findMany({
            where: { userId: session.userId }
        })

        const totalPoints = pointsRecords.reduce((acc, row) => acc + row.points, 0)

        // Find recent history
        const history = await prisma.loyaltyPoints.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        })

        return { success: true, totalPoints, history }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to fetch loyalty points' }
    }
}
