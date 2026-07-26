'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function createNotification(userId: string, title: string, message: string, type: string) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            },
        })
        
        const { pusherServer } = await import('@/lib/pusherServer');
        await pusherServer.trigger(`private-user_${userId}`, 'new_notification', notification);
        
        return { success: true, notification }
    } catch (err) {
        console.error('Failed to create notification', err)
        return { error: 'Failed to create notification' }
    }
}

export async function getMyNotifications() {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' },
        })
        return { success: true, notifications }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to fetch notifications' }
    }
}

export async function markAsRead(notificationId: string) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    try {
        const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        })
        return { success: true, notification }
    } catch (err) {
        console.error(err)
        return { error: 'Failed to mark notification as read' }
    }
}
