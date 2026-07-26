'use server'

import { prisma } from '@/lib/prisma'

export type SearchFilters = {
    query?: string
    category?: string
    city?: string
    minRating?: number
    lat?: number
    lng?: number
}

// Helper: Haversine distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
}

export async function searchBusinesses(filters: SearchFilters) {
    try {
        const { query, category, city, minRating, lat, lng } = filters

        // Build Prisma where clause dynamically based on provided filters
        const whereClause: any = {
            status: 'APPROVED'
        }

        if (query) {
            whereClause.OR = [
                { name: { contains: query } },
                { description: { contains: query } },
                { services: { some: { name: { contains: query } } } }
            ]
        }

        if (category) {
            whereClause.category = category
        }

        if (city) {
            whereClause.city = { contains: city }
        }

        if (minRating) {
            whereClause.rating = { gte: minRating }
        }

        let businesses = await prisma.business.findMany({
            where: whereClause,
            include: {
                services: true
            },
            orderBy: {
                rating: 'desc'
            }
        })

        // Sort by distance if coordinates are provided
        if (lat !== undefined && lng !== undefined) {
            businesses.sort((a, b) => {
                if (!a.latitude || !a.longitude) return 1;
                if (!b.latitude || !b.longitude) return -1;
                const distA = calculateDistance(lat, lng, a.latitude, a.longitude);
                const distB = calculateDistance(lat, lng, b.latitude, b.longitude);
                return distA - distB;
            });
        }

        return { success: true, businesses }

    } catch (error) {
        console.error('Search error:', error)
        return { error: 'Failed to search businesses' }
    }
}
