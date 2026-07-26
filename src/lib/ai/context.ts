import { prisma } from '@/lib/prisma';
import { AIRole } from './guard';
import { OwnerPersona } from './registry';

export async function buildAIContext(
  role: AIRole,
  userId?: string,
  ownerPersona?: OwnerPersona
): Promise<string> {
  try {
    if (role === 'PUBLIC') {
      const categories = await prisma.category.findMany({
        select: { name: true, description: true },
        take: 10,
      });
      const topBusinesses = await prisma.business.findMany({
        where: { status: 'APPROVED' },
        select: { name: true, category: true, city: true, rating: true },
        take: 5,
        orderBy: { rating: 'desc' },
      });

      return `
[SYSTEM CONTEXT - PUBLIC PORTAL]
Platform: Servorix
Available Categories: ${categories.map((c) => c.name).join(', ')}
Sample Popular Businesses: ${topBusinesses
        .map((b) => `${b.name} (${b.category} in ${b.city}, Rating: ${b.rating})`)
        .join('; ')}
`;
    }

    if (role === 'CUSTOMER' && userId) {
      const customer = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });
      const recentAppointments = await prisma.appointment.findMany({
        where: { customerId: userId },
        include: {
          business: { select: { name: true } },
          service: { select: { name: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      });

      return `
[SYSTEM CONTEXT - CUSTOMER PORTAL]
Customer Name: ${customer?.name || 'Customer'}
Recent Bookings: ${
        recentAppointments.length > 0
          ? recentAppointments
              .map(
                (a) =>
                  `${a.service.name} at ${a.business.name} on ${a.date} (${a.status})`
              )
              .join('; ')
          : 'No past bookings found.'
      }
`;
    }

    if (role === 'OWNER' && userId) {
      const businesses = await prisma.business.findMany({
        where: { ownerId: userId },
        include: {
          services: { select: { name: true, price: true } },
          appointments: { select: { status: true } },
          payments: {
            where: { status: 'COMPLETED' },
            select: { ownerAmount: true },
          },
        },
      });

      if (businesses.length === 0) {
        return `[SYSTEM CONTEXT - OWNER PORTAL]\nOwner has no registered businesses yet.`;
      }

      const summary = businesses.map((b) => {
        const rev = b.payments.reduce((acc, p) => acc + p.ownerAmount, 0);
        return `Business: "${b.name}" (${b.category}), Services: [${b.services
          .map((s) => `${s.name}:$${s.price}`)
          .join(', ')}], Total Appointments: ${b.appointments.length}, Estimated Net Revenue: $${rev}`;
      });

      return `
[SYSTEM CONTEXT - OWNER PORTAL (${ownerPersona || 'BUSINESS'})]
${summary.join('\n')}
`;
    }

    if (role === 'ADMIN') {
      const userCount = await prisma.user.count();
      const businessCount = await prisma.business.count();
      const pendingBusinesses = await prisma.business.count({
        where: { status: 'PENDING' },
      });

      return `
[SYSTEM CONTEXT - ADMIN PORTAL]
Total Users: ${userCount}
Total Registered Businesses: ${businessCount}
Pending Approval Requests: ${pendingBusinesses}
`;
    }

    return '';
  } catch (error) {
    console.error('Error building AI context:', error);
    return '[SYSTEM CONTEXT - DATA TEMPORARILY UNAVAILABLE]';
  }
}
