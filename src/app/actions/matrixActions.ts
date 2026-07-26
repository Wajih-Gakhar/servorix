'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { pusherServer } from '@/lib/pusherServer'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'

// 1. getOrCreateConversation
export async function getOrCreateConversation(type: string, participantIds: string[], businessId?: string, bookingId?: string) {
  try {
    const session = await getSession();
    if (!session) {
        return { error: 'Unauthorized Access' };
    }

    // Special case for OWNER_ADMIN or support: If only one user is provided, add an Admin automatically.
    let targetParticipants = [...participantIds];
    if (type === 'OWNER_ADMIN' && targetParticipants.length === 1) {
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (admin && !targetParticipants.includes(admin.id)) {
            targetParticipants.push(admin.id);
        }
    }

    if (!targetParticipants.includes(session.userId)) {
        return { error: 'Access Denied' };
    }

    // Try finding an exact existing conversation
    const existing = await prisma.conversation.findFirst({
        where: {
            type,
            businessId: businessId || null,
            bookingId: bookingId || null,
            participants: {
                every: {
                    userId: { in: targetParticipants }
                }
            }
        },
        include: { participants: true }
    });

    if (existing && existing.participants.length === targetParticipants.length) {
        return { success: true, conversation: existing };
    }

    // Create new
    const newConv = await prisma.conversation.create({
        data: {
            type,
            businessId,
            bookingId,
            reportStatus: type === 'REPORT' ? 'OPEN' : null,
            participants: {
                create: targetParticipants.map(id => ({ userId: id }))
            }
        },
        include: { participants: true }
    });

    revalidatePath('/messages', 'layout');
    revalidatePath('/dashboard', 'layout');
    return { success: true, conversation: newConv };
  } catch (error: any) {
    console.error("getOrCreateConversation error:", error);
    return { error: 'Failed to synchronize conversation thread.' };
  }
}

// 2. sendMessage
export async function sendMessage(conversationId: string, content: string, fileBase64?: string) {
  try {
     const session = await getSession();
     if (!session) return { error: 'Unauthorized' };

     // Verify participant access
     const participant = await prisma.conversationParticipant.findUnique({
         where: { conversationId_userId: { conversationId, userId: session.userId } }
     });
     if (!participant) return { error: 'Access Denied' };

     let fileUrl = null;
     let fileType = null;

     // Handle file upload if present
     if (fileBase64) {
         const uploadRes = await uploadToCloudinary(fileBase64);
         fileUrl = uploadRes.url;
         fileType = uploadRes.type;
     }

     const message = await prisma.message.create({
         data: {
             conversationId,
             senderId: session.userId,
             content,
             fileUrl,
             fileType
         },
         include: {
             sender: { select: { id: true, name: true, profileImage: true } }
         }
     });

     // Auto-mark as seen for sender
     await prisma.messageSeen.create({
         data: { messageId: message.id, userId: session.userId }
     });

     // Reset hiddenAt for all participants to ensure the message is visible
     await prisma.conversationParticipant.updateMany({
         where: { conversationId },
         data: { hiddenAt: null }
     });

      // Trigger Pusher Event on Conversation Channel
      await pusherServer.trigger(`presence-conversation_${conversationId}`, 'new_message', message);

      // Trigger Unread Count Updates for other participants
      const otherParticipants = await prisma.conversationParticipant.findMany({
          where: { conversationId, NOT: { userId: session.userId } }
      });

      for (const p of otherParticipants) {
          await pusherServer.trigger(`private-user_${p.userId}`, 'unread_count_update', { increment: true });
      }

     revalidatePath('/messages', 'layout');
     revalidatePath('/dashboard', 'layout');
     return { success: true, message };
  } catch (error: any) {
     return { error: 'Transmission failed.' };
  }
}

// 3. getUserConversations
export async function getUserConversations() {
   try {
       const session = await getSession();
       if (!session) return { error: 'Unauthorized' };

       const conversations: any = await prisma.conversation.findMany({
           where: {
               participants: { some: { userId: session.userId, hiddenAt: null } }
           },
           include: {
               participants: {
                   include: { user: { select: { id: true, name: true, profileImage: true, role: true } } }
               },
               messages: {
                   orderBy: { createdAt: 'desc' },
                   take: 1,
                   include: { seenBy: true }
               },
               business: { select: { name: true, id: true } }
           } as any,
           orderBy: { updatedAt: 'desc' }
       });

       return { success: true, conversations };
   } catch(e: any) {
       return { error: 'Retrieval failed.' };
   }
}

// 4. getMessages (with basic pagination)
export async function getMessages(conversationId: string, cursor?: string) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: { 
                sender: { select: { id: true, name: true, profileImage: true } },
                seenBy: true 
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0
        });

        return { success: true, messages: messages.reverse() }; // Return chronological
    } catch(err: any) {
        return { error: 'Sync failed.' };
    }
}

// 4.1 getConversationById
export async function getConversationById(conversationId: string) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    include: { user: { select: { id: true, name: true, role: true } } }
                }
            }
        });

        if (!conversation) return { error: 'Conversation not found.' };

        // Verify participant
        const isParticipant = conversation.participants.some(p => p.userId === session.userId);
        if (!isParticipant && (session as any).role !== 'ADMIN') {
            return { error: 'Access Denied' };
        }

        return { success: true, conversation };
    } catch(e: any) {
        return { error: 'Metadata retrieval failed.' };
    }
}

// 5. markMessagesAsSeen
export async function markMessagesAsSeen(conversationId: string) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        const unseenMessages = await prisma.message.findMany({
            where: { 
                conversationId, 
                seenBy: { none: { userId: session.userId } } 
            }
        });

        if (unseenMessages.length > 0) {
            await prisma.messageSeen.createMany({
                data: unseenMessages.map(m => ({
                    messageId: m.id,
                    userId: session.userId
                }))
            });

            // Revalidate path for unread badge updates
            revalidatePath('/dashboard', 'layout');

            // Trigger real-time global count update for the user
            await pusherServer.trigger(`private-user_${session.userId}`, 'unread_count_update', { refresh: true });
        }

        return { success: true };
    } catch(err: any) {
        return { error: 'Flag update failed.' };
    }
}

// 6. getUnreadCount
export async function getUnreadCount() {
    try {
       const session = await getSession();
       if (!session) return { count: 0 };
       
       const count = await prisma.message.count({
           where: {
               conversation: { participants: { some: { userId: session.userId } } },
               NOT: { senderId: session.userId },
               seenBy: { none: { userId: session.userId } }
           }
       });

       return { count };
    } catch(e: any) {
       return { count: 0 };
    }
}

// 7. createReport
export async function createReport(businessId: string, reason: string, description?: string) {
    try {
        const session = await getSession();
        if (!session || (session as any).role !== 'CUSTOMER') {
            return { error: 'Unauthorized. Only users can file reports.' };
        }

        const business = await prisma.business.findUnique({ where: { id: businessId } });
        if (!business) return { error: 'Business not found.' };
        if (business.ownerId === session.userId) {
            return { error: 'Action denied. You cannot report your own business.' };
        }

        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (!admin) return { error: 'Admin relay offline. No admin found.' };

        // Check for existing report
        const existingReport = await prisma.conversation.findFirst({
            where: {
                type: 'REPORT',
                businessId,
                participants: { some: { userId: session.userId } }
            }
        });

        if (existingReport) {
            await prisma.message.create({
                data: {
                    conversationId: existingReport.id,
                    senderId: session.userId,
                    content: `FOLLOW-UP REPORT\nReason: ${reason}\n\nDescription: ${description || 'N/A'}`
                }
            });
            revalidatePath('/dashboard');
            return { success: true, conversationId: existingReport.id };
        }

        // New system report record
        const conversation = await prisma.conversation.create({
            data: {
                type: 'REPORT',
                businessId,
                reportReason: reason,
                reportDesc: description,
                reportStatus: 'OPEN',
                participants: {
                    create: [
                        { userId: session.userId },
                        { userId: admin.id }
                    ]
                }
            }
        });

        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: session.userId,
                content: `INITIAL REPORT\nReason: ${reason}\n\nDescription: ${description || 'N/A'}`
            }
        });
        
        revalidatePath('/dashboard');
        return { success: true, conversationId: conversation.id };
    } catch(e: any) {
        console.error("REPORT_DISPATCH_FAILURE:", e);
        const errorMsg = e instanceof Error ? e.message : String(e);
        return { error: 'Report dispatch failed: ' + errorMsg };
    }
}

// 8. updateReportStatus
export async function updateReportStatus(conversationId: string, status: string) {
    try {
        const session = await getSession();
        if (!session || (session as any).role !== 'ADMIN') return { error: 'Unauthorized access.' };
        
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { reportStatus: status }
        });
        
        revalidatePath('/admin/reports');
        revalidatePath(`/admin/reports/${conversationId}`);
        return { success: true };
    } catch(e: any) {
        return { error: 'Failed to update report status.' };
    }
}

// 9. getAdminReports (Production-Grade)
export async function getAdminReports(status?: string, page: number = 1, limit: number = 15) {
    try {
        const session = await getSession();
        if (!session || (session as any).role !== 'ADMIN') return { error: 'Unauthorized.' };

        const skip = (page - 1) * limit;
        const where: any = { type: 'REPORT' };
        if (status && status !== 'ALL') where.reportStatus = status;

        const [reports, total]: [any[], number] = await Promise.all([
            prisma.conversation.findMany({
                where,
                include: {
                    participants: {
                        include: { user: { select: { id: true, name: true, email: true, role: true } } }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    },
                    business: { select: { id: true, name: true } }
                } as any,
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.conversation.count({ where })
        ]);

        const formattedReports = reports.map((r: any) => {
            const reporter = r.participants?.find((p: any) => p.user?.role === 'CUSTOMER')?.user;
            
            return {
                id: r.id,
                businessName: r.business?.name || 'Unknown',
                businessId: r.business?.id,
                reporterName: reporter?.name || 'Unknown',
                reporterEmail: reporter?.email || 'Unknown',
                reason: r.reportReason,
                status: r.reportStatus,
                lastMessage: r.messages?.[0]?.content || 'No messages',
                createdAt: r.createdAt,
                updatedAt: r.updatedAt
            };
        });

        return { 
            success: true, 
            reports: formattedReports,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page
            }
        };
    } catch(e: any) {
        console.error("getAdminReports Error:", e);
        return { error: 'Failed to load reports system.' };
    }
}

// 10. getAdminReportById
export async function getAdminReportById(conversationId: string) {
    try {
        const session = await getSession();
        if (!session || (session as any).role !== 'ADMIN') return { error: 'Unauthorized.' };

        const report = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    include: { user: { select: { id: true, name: true, email: true, role: true, profileImage: true } } }
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { name: true, role: true, profileImage: true } } }
                }
            }
        });

        if (!report || report.type !== 'REPORT') return { error: 'Report not found.' };

        const business = report.businessId ? await prisma.business.findUnique({ 
            where: { id: report.businessId },
            include: { owner: { select: { name: true, email: true } } }
        }) : null;

        const reporter = report.participants.find(p => p.user.role === 'CUSTOMER')?.user;

        return {
            success: true,
            report: {
                ...report,
                business,
                reporter
            }
        };
    } catch(e: any) {
        return { error: 'Failed to load report details.' };
    }
}

// 11. adminReplyToReport
export async function adminReplyToReport(conversationId: string, content: string) {
    try {
        const session = await getSession();
        if (!session || (session as any).role !== 'ADMIN') return { error: 'Unauthorized.' };

        // Verify conversation is a report
        const report = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!report || report.type !== 'REPORT') return { error: 'Invalid target.' };

     const message = await prisma.message.create({
         data: {
             conversationId,
             senderId: session.userId,
             content
         },
         include: {
             sender: { select: { id: true, name: true, profileImage: true, role: true } }
         }
     });

     // Ensure the report becomes visible to the reporter again if hidden
     await prisma.conversationParticipant.updateMany({
        where: { conversationId },
        data: { hiddenAt: null }
     });

        // Trigger real-time update
        await pusherServer.trigger(`presence-conversation_${conversationId}`, 'new_message', message);

        revalidatePath(`/admin/reports/${conversationId}`);
        return { success: true, message };
    } catch(e: any) {
        return { error: 'Dispatch failed.' };
    }
}

// 10. deleteMessageSoft
export async function deleteMessageSoft(messageId: string) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: { conversation: true }
        });

        if (!message) return { error: 'Message not found' };
        
        // Ownership check (Sender OR Admin)
        if (message.senderId !== session.userId && (session as any).role !== 'ADMIN') {
            return { error: 'Permission denied' };
        }

        // 4. Soft Delete Implementation (Strict Audit Trail)
        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: { 
                deletedAt: new Date(),
                // DO NOT overwrite content to preserve the audit trail for Admins.
                // The frontend must use the `deletedAt` field to mask the content from standard users.
            }
        });

        // Trigger real-time soft deletion update
        await pusherServer.trigger(`presence-conversation_${message.conversationId}`, 'message_updated', { message: updatedMessage });

        revalidatePath('/messages', 'layout');
        return { success: true };
    } catch(e: any) {
        return { error: 'Delete failed.' };
    }
}

// 12. adminArchiveReport (The Professional Option)
export async function adminArchiveReport(conversationId: string) {
    try {
        const session = await getSession();
        if (!session || (session as any).role !== 'ADMIN') return { error: 'Unauthorized.' };

        const conversation: any = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: true, business: true } as any
        });

        if (!conversation || conversation.type !== 'REPORT') return { error: 'Report not found.' };

        // 1. Find the customer (reporter)
        const reporters = await prisma.conversationParticipant.findMany({
            where: { conversationId, user: { role: 'CUSTOMER' } },
            include: { user: true }
        });

        // 2. Notify each reporter
        for (const r of reporters) {
            await prisma.notification.create({
                data: {
                    userId: r.userId,
                    title: 'Report Status Update',
                    message: `We are currently reviewing your report regarding ${conversation.business?.name || 'a business'}. This thread has been moved to our internal review system.`,
                    type: 'SYSTEM'
                }
            });

            // 3. Hide from their active view
            await prisma.conversationParticipant.update({
                where: { id: r.id },
                data: { hiddenAt: new Date() }
            });

            // 4. Trigger unread count refresh and conversation ejection
            await pusherServer.trigger(`private-user_${r.userId}`, 'conversation_deleted', { conversationId });
            await pusherServer.trigger(`private-user_${r.userId}`, 'unread_count_update', { refresh: true });
        }

        // 5. Update status
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { reportStatus: 'RESOLVED' }
        });

        revalidatePath('/messages', 'layout');
        revalidatePath('/dashboard', 'layout');
        revalidatePath(`/admin/reports/${conversationId}`);
        
        return { success: true };
    } catch(e: any) {
        console.error("Archive Error:", e);
        return { error: 'Failed to process report archival.' };
    }
}

// 14. Standard deleteConversation (Consolidated for regular and report chats)
export async function deleteConversation(conversationId: string) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        // Verify participant
        const participant = await prisma.conversationParticipant.findUnique({
            where: { conversationId_userId: { conversationId, userId: session.userId } },
            include: { conversation: true }
        });
        
        const isAdmin = (session as any).role === 'ADMIN';

        if (!participant && !isAdmin) {
            return { error: 'Access Denied' };
        }

        const conversation = participant?.conversation || await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation) return { error: 'Conversation not found' };

        // Logic: Admins soft-delete globally. Users can only hide partitions.
        if (isAdmin) {
            await prisma.conversation.update({ 
                where: { id: conversationId },
                data: { deletedAt: new Date() }
            });
        } else if (participant) {
            await prisma.conversationParticipant.update({
                where: { id: participant.id },
                data: { hiddenAt: new Date() }
            });
        }

        await pusherServer.trigger(`private-user_${session.userId}`, 'conversation_deleted', { conversationId });

        revalidatePath('/messages', 'layout');
        revalidatePath('/dashboard', 'layout');
        return { success: true };
    } catch(e: any) {
        return { error: 'Failed to process deletion.' };
    }
}
