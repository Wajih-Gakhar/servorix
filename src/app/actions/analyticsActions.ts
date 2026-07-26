'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// ─── Helper ──────────────────────────────────────────────────────────────────

function getLast(days: number): string[] {
    const result: string[] = []
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        result.push(d.toISOString().split('T')[0])
    }
    return result
}

// ─── Auth guard ──────────────────────────────────────────────────────────────

async function getOwnerBusinessIds(): Promise<{ businessIds: string[] } | { error: string }> {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }
    const businesses = await prisma.business.findMany({
        where: { ownerId: session.userId },
        select: { id: true }
    })
    return { businessIds: businesses.map(b => b.id) }
}

// ─── 1. Overview (KPI cards) ─────────────────────────────────────────────────

export async function getAnalyticsOverview() {
    const auth = await getOwnerBusinessIds()
    if ('error' in auth) return { error: auth.error }
    const { businessIds } = auth

    if (businessIds.length === 0) return { data: null }

    const [totalBookings, completedBookings, payments, reviews, customers] = await Promise.all([
        prisma.appointment.count({ where: { businessId: { in: businessIds } } }),
        prisma.appointment.count({ where: { businessId: { in: businessIds }, status: 'COMPLETED' } }),
        prisma.payment.findMany({ where: { businessId: { in: businessIds }, status: 'COMPLETED' }, select: { ownerAmount: true, createdAt: true } }),
        prisma.review.findMany({ where: { businessId: { in: businessIds } }, select: { rating: true } }),
        prisma.appointment.findMany({ where: { businessId: { in: businessIds } }, select: { customerId: true }, distinct: ['customerId'] }),
    ])

    const totalRevenue = payments.reduce((sum, p) => sum + p.ownerAmount, 0)
    const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

    // Calculate Month-over-Month growth
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const thisMonthRevenue = payments
        .filter(p => p.createdAt >= firstDayThisMonth)
        .reduce((sum, p) => sum + p.ownerAmount, 0)
        
    const lastMonthRevenue = payments
        .filter(p => p.createdAt >= firstDayLastMonth && p.createdAt < firstDayThisMonth)
        .reduce((sum, p) => sum + p.ownerAmount, 0)

    const momGrowth = lastMonthRevenue === 0 
        ? (thisMonthRevenue > 0 ? 100 : 0) 
        : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

    return {
        data: {
            totalBookings,
            completedBookings,
            totalRevenue,
            totalCustomers: customers.length,
            avgRating: parseFloat(avgRating.toFixed(1)),
            momGrowth: parseFloat(momGrowth.toFixed(1)),
            thisMonthRevenue,
        }
    }
}

export async function getCustomerRetention() {
    const auth = await getOwnerBusinessIds()
    if ('error' in auth) return { error: auth.error }
    const { businessIds } = auth

    const appointments = await prisma.appointment.findMany({
        where: { businessId: { in: businessIds }, status: 'COMPLETED' },
        select: { customerId: true }
    })

    const bookingCounts: Record<string, number> = {}
    appointments.forEach(a => {
        bookingCounts[a.customerId] = (bookingCounts[a.customerId] || 0) + 1
    })

    const totalUnique = Object.keys(bookingCounts).length
    const repeatCustomers = Object.values(bookingCounts).filter(count => count > 1).length

    const retentionRate = totalUnique === 0 ? 0 : (repeatCustomers / totalUnique) * 100

    return {
        data: {
            totalUnique,
            repeatCustomers,
            retentionRate: parseFloat(retentionRate.toFixed(1))
        }
    }
}

// ─── 2. Booking Trends ───────────────────────────────────────────────────────

export async function getBookingTrends(days: number = 7) {
    const auth = await getOwnerBusinessIds()
    if ('error' in auth) return { error: auth.error }
    const { businessIds } = auth

    const dates = getLast(days)
    const since = dates[0]

    const appointments = await prisma.appointment.findMany({
        where: { businessId: { in: businessIds }, date: { gte: since } },
        select: { date: true, status: true }
    })

    const countByDate: Record<string, { total: number; completed: number }> = {}
    appointments.forEach(a => {
        if (!countByDate[a.date]) countByDate[a.date] = { total: 0, completed: 0 }
        countByDate[a.date].total += 1
        if (a.status === 'COMPLETED') countByDate[a.date].completed += 1
    })

    const data = dates.map(date => {
        const d = new Date(date)
        const label = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0) + (days > 7 ? d.getDate() : '')
        return {
            date,
            label: days <= 7 ? d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2) : `${d.getDate()}/${d.getMonth() + 1}`,
            total: countByDate[date]?.total ?? 0,
            completed: countByDate[date]?.completed ?? 0,
        }
    })

    return { data }
}

// ─── 3. Revenue Trends ───────────────────────────────────────────────────────

export async function getRevenueTrends(days: number = 7) {
    const auth = await getOwnerBusinessIds()
    if ('error' in auth) return { error: auth.error }
    const { businessIds } = auth

    const dates = getLast(days)
    const since = new Date(dates[0])

    const payments = await prisma.payment.findMany({
        where: { businessId: { in: businessIds }, status: 'COMPLETED', createdAt: { gte: since } },
        select: { amount: true, ownerAmount: true, createdAt: true }
    })

    const revenueByDate: Record<string, { gross: number; net: number }> = {}
    payments.forEach(p => {
        const day = p.createdAt.toISOString().split('T')[0]
        if (!revenueByDate[day]) revenueByDate[day] = { gross: 0, net: 0 }
        revenueByDate[day].gross += p.amount
        revenueByDate[day].net += p.ownerAmount
    })

    const data = dates.map(date => {
        const d = new Date(date)
        return {
            date,
            label: days <= 7 ? d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2) : `${d.getDate()}/${d.getMonth() + 1}`,
            gross: parseFloat((revenueByDate[date]?.gross ?? 0).toFixed(2)),
            net: parseFloat((revenueByDate[date]?.net ?? 0).toFixed(2)),
        }
    })

    return { data }
}

// ─── 4. Service Breakdown ────────────────────────────────────────────────────

export async function getServiceBookings() {
    const auth = await getOwnerBusinessIds()
    if ('error' in auth) return { error: auth.error }
    const { businessIds } = auth

    const appointments = await prisma.appointment.findMany({
        where: { businessId: { in: businessIds } },
        include: { service: { select: { name: true } } }
    })

    const counts: Record<string, number> = {}
    appointments.forEach(a => {
        counts[a.service.name] = (counts[a.service.name] || 0) + 1
    })

    const data = Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)

    return { data }
}

// ─── 5. Weekly summary (used by existing ChartWrapper) ───────────────────────

export async function getOwnerAnalytics() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }

    try {
        const businesses = await prisma.business.findMany({
            where: { ownerId: session.userId },
            select: { id: true, services: true }
        })
        const businessIds = businesses.map(b => b.id)
        if (businessIds.length === 0) return { success: true, data: null }

        const [appointments, payments, reviews] = await Promise.all([
            prisma.appointment.findMany({ where: { businessId: { in: businessIds } }, include: { service: true } }),
            prisma.payment.findMany({ where: { businessId: { in: businessIds }, status: 'COMPLETED' } }),
            prisma.review.findMany({ where: { businessId: { in: businessIds } }, select: { rating: true } }),
        ])

        const totalBookings = appointments.length
        const totalRevenue = payments.reduce((acc, p) => acc + p.ownerAmount, 0)
        const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0

        const serviceCounts: Record<string, number> = {}
        const hourCounts: Record<string, number> = {}
        appointments.forEach(app => {
            serviceCounts[app.service.name] = (serviceCounts[app.service.name] || 0) + 1
            const hour = app.startTime.split(':')[0]
            hourCounts[`${hour}:00`] = (hourCounts[`${hour}:00`] || 0) + 1
        })

        const popularServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
        const peakHours = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
        const monthCounts: Record<string, number> = {}
        appointments.forEach(app => {
            const month = app.date.substring(0, 7)
            monthCounts[month] = (monthCounts[month] || 0) + 1
        })
        const monthlyTrends = Object.entries(monthCounts).sort((a, b) => a[0].localeCompare(b[0]))

        const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const today = new Date()
        const last7: { date: string; label: string }[] = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(today.getDate() - i)
            const iso = d.toISOString().split('T')[0]
            last7.push({ date: iso, label: DAY_SHORT[d.getDay()].charAt(0) })
        }
        const dailyBookingCounts: Record<string, number> = {}
        appointments.forEach(app => { dailyBookingCounts[app.date] = (dailyBookingCounts[app.date] || 0) + 1 })
        const dailyRevenueCounts: Record<string, number> = {}
        payments.forEach(p => {
            const day = p.createdAt.toISOString().split('T')[0]
            dailyRevenueCounts[day] = (dailyRevenueCounts[day] || 0) + p.ownerAmount
        })
        const weeklyTrends = last7.map(({ date, label }) => ({
            label,
            bookings: dailyBookingCounts[date] || 0,
            revenue: Math.round(dailyRevenueCounts[date] || 0),
        }))

        return {
            success: true,
            data: { totalBookings, totalRevenue, avgRating, popularServices, peakHours, monthlyTrends, weeklyTrends }
        }
    } catch (err) {
        console.error(err)
        return { error: 'Failed' }
    }
}
