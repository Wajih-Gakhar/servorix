'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createNotification } from './notificationActions'
import { revalidatePath } from 'next/cache'

// Fetch all businesses
export async function getAllBusinesses() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

    try {
        const businesses = await prisma.business.findMany({
            include: { owner: { select: { name: true, email: true } }, services: true, reviews: true },
        })
        return { success: true, businesses }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to fetch businesses' }
    }
}

// Approve, Reject, Suspend
export async function updateBusinessStatus(businessId: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'DELETED') {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

    try {
        const business = await prisma.business.update({
            where: { id: businessId },
            data: { status },
            include: { owner: true } // Need owner to send notification
        })

        // Notify owner
        await createNotification(
            business.owner.id,
            `Business ${status}`,
            `Your business "${business.name}" has been ${status.toLowerCase()}.`,
            'SYSTEM'
        )

        return { success: true, business }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to update business status' }
    }
}

// Soft delete
export async function softDeleteBusiness(businessId: string) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

    try {
        const business = await prisma.business.update({
            where: { id: businessId },
            data: { status: 'DELETED' },
        })
        revalidatePath('/admin/reports');
        return { success: true, business }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to soft delete business' }
    }
}

// Suspend business
export async function suspendBusiness(businessId: string) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

    try {
        const business = await prisma.business.update({
            where: { id: businessId },
            data: { status: 'SUSPENDED' },
            include: { owner: true }
        })

        await createNotification(
            business.ownerId,
            'Business Suspended',
            `Your business "${business.name}" has been suspended due to policy violations.`,
            'SYSTEM'
        )

        revalidatePath('/admin/reports');
        return { success: true, business }
    } catch (err) {
        return { error: 'Failed to suspend business' }
    }
}

// Restore
export async function restoreBusiness(businessId: string) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

    try {
        const business = await prisma.business.update({
            where: { id: businessId },
            data: { status: 'APPROVED' },
        })
        return { success: true, business }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to restore business' }
    }
}

// Permanently delete
export async function permanentlyDeleteBusiness(businessId: string) {
    const session = await getSession()

    console.log("DELETE REQUEST:", businessId)

    if (!session || session.role !== 'ADMIN') {
        console.log("NOT ADMIN")
        return { error: 'Unauthorized' }
    }

    try {
        const deletedBusiness = await prisma.business.delete({
            where: { id: businessId },
        })

        console.log("DELETED:", deletedBusiness)

        return { success: true, deletedBusiness }
    } catch (err) {
        console.error("DELETE ERROR:", err)
        return { error: 'Failed to permanently delete business' }
    }
}