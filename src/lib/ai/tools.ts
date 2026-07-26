import { tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const publicTools = {
  searchBusinesses: tool({
    description: 'Search for active businesses by category, name, or city. ONLY call when the user explicitly asks to locate, search for, or get recommendations for specific local businesses or services. DO NOT call for general how-to, FAQ, or platform questions.',
    parameters: z.object({
      query: z.string().optional().describe('Search query for business name or description'),
      category: z.string().optional().describe('Category name like Barbershop, Spa, Hair Salon'),
      city: z.string().optional().describe('City name'),
    }),
    execute: async (args: any) => {
      const { query, category, city } = args || {};
      const whereClause: any = { status: 'APPROVED' };
      if (category) whereClause.category = category;
      if (city) whereClause.city = { contains: city, mode: 'insensitive' };
      if (query) {
        whereClause.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ];
      }

      const businesses = await prisma.business.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          category: true,
          city: true,
          rating: true,
          openingTime: true,
          closingTime: true,
          services: { select: { id: true, name: true, price: true, duration: true } },
        },
        take: 5,
      });
      return businesses;
    },
  } as any),
};

export const customerTools = {
  ...publicTools,
  getCustomerAppointments: tool({
    description: 'Fetch specific appointment records for the authenticated customer. ONLY call when the customer explicitly asks to view, check, or list their personal appointments or booking history. DO NOT call for general how-to, cancellation policy, or FAQ questions.',
    parameters: z.object({
      customerId: z.string(),
    }),
    execute: async (args: any) => {
      const { customerId } = args || {};
      const appointments = await prisma.appointment.findMany({
        where: { customerId },
        include: {
          business: { select: { name: true, address: true, phone: true } },
          service: { select: { name: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      return appointments;
    },
  } as any),
};

export const ownerTools = {
  getOwnerBusinessSummary: tool({
    description: 'Fetch specific business performance metrics and booking stats for an owner. ONLY call when the owner explicitly asks to retrieve their real revenue, appointment counts, or business metrics. DO NOT call for general strategic advice or how-to questions.',
    parameters: z.object({
      ownerId: z.string(),
    }),
    execute: async (args: any) => {
      const { ownerId } = args || {};
      const businesses = await prisma.business.findMany({
        where: { ownerId },
        include: {
          services: true,
          appointments: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { service: true, customer: { select: { name: true } } },
          },
          payments: {
            where: { status: 'COMPLETED' },
            select: { amount: true, ownerAmount: true, createdAt: true },
          },
        },
      });

      return businesses.map((b) => {
        const totalRevenue = b.payments.reduce((sum, p) => sum + p.ownerAmount, 0);
        return {
          id: b.id,
          name: b.name,
          category: b.category,
          rating: b.rating,
          totalBookings: b.appointments.length,
          totalRevenue,
          servicesCount: b.services.length,
          recentAppointments: b.appointments,
        };
      });
    },
  } as any),
};

export const adminTools = {
  getPlatformOverview: tool({
    description: 'Fetch platform-wide high-level metrics for admin dashboards. ONLY call when the admin explicitly requests overall system metrics, total user counts, gross revenue, or platform fees. DO NOT call for general policy or how-to questions.',
    parameters: z.object({}),
    execute: async () => {
      const [userCount, businessCount, bookingCount, totalPayments] = await Promise.all([
        prisma.user.count(),
        prisma.business.count(),
        prisma.appointment.count(),
        prisma.payment.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true, platformFee: true },
        }),
      ]);

      return {
        totalUsers: userCount,
        totalBusinesses: businessCount,
        totalBookings: bookingCount,
        totalGrossRevenue: totalPayments._sum.amount || 0,
        totalPlatformFees: totalPayments._sum.platformFee || 0,
      };
    },
  } as any),
};
