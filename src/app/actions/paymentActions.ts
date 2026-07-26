'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createNotification } from './notificationActions'

export async function getAdminPayments() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

    try {
        const payments = await prisma.payment.findMany({
            include: {
                business: { select: { id: true, name: true, ownerId: true } },
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' },
        })

        const businesses = await prisma.business.findMany({
             select: { id: true, name: true, ownerId: true, status: true }
        })

        return { success: true, payments, businesses }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to fetch payments' }
    }
}

export async function sendPaymentReminder(businessId: string) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

    try {
        const business = await prisma.business.findUnique({ where: { id: businessId } })
        if (!business) return { error: 'Business not found' }

        await createNotification(
            business.ownerId, 
            'Payment Reminder', 
            `You have pending platform fees for ${business.name}. Please settle them to prevent business suspension.`, 
            'SYSTEM'
        )
        return { success: true }
    } catch (err) {
        return { error: 'Failed to send reminder' }
    }
}

export async function getOwnerPayments() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') return { error: 'Unauthorized' }

    try {
        const businesses = await prisma.business.findMany({
            where: { ownerId: session.userId },
            select: { id: true }
        })
        const businessIds = businesses.map(b => b.id)

        const payments = await prisma.payment.findMany({
            where: { businessId: { in: businessIds } },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        })

        return { success: true, payments }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to find payments' }
    }
}

export async function executePayment(bookingId: string, businessId: string, amount: number, method: 'JAZZCASH' | 'EASYPAISA' | 'CARD' | 'PAY_ON_VISIT') {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    if (method === 'PAY_ON_VISIT') {
        const payment = await prisma.payment.create({
            data: {
                bookingId,
                businessId,
                userId: session.userId,
                amount,
                platformFee: amount * 0.05,
                ownerAmount: amount - (amount * 0.05),
                paymentMethod: 'CASH',
                paymentType: 'PAY_ON_VISIT',
                status: 'PENDING'
            }
        });
        return { success: true, payment };
    }

    const { JazzCashAdapter, EasypaisaAdapter, CardAdapter } = await import('./paymentProviders/mockAdapters');
    let provider: any;

    switch (method) {
        case 'JAZZCASH': provider = new JazzCashAdapter(); break;
        case 'EASYPAISA': provider = new EasypaisaAdapter(); break;
        case 'CARD': provider = new CardAdapter(); break;
        default: return { error: 'Invalid payment method' };
    }

    const metadata = { userId: session.userId, businessId, bookingId };
    const result = await provider.processPayment(amount, 'PKR', metadata);

    if (!result.success || !result.transactionId) {
        return { error: result.error || 'Payment failed at gateway.' };
    }

    // Persist to database
    const platformFee = amount * 0.05;
    const ownerAmount = amount - platformFee;

    const payment = await prisma.payment.create({
        data: {
            bookingId,
            businessId,
            userId: session.userId,
            amount,
            platformFee,
            ownerAmount,
            paymentMethod: method,
            paymentType: 'FULL',
            status: 'COMPLETED' // Since it's mocked as instant success
        }
    });

    return { success: true, payment };
}
