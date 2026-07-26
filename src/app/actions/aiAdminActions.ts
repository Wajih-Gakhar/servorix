'use server';

import { getSession } from '@/lib/auth';
import { processAIRequest } from '@/lib/ai/engine';

export async function sendAdminAIMessage(prompt: string, conversationId?: string) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return { success: false, content: 'Unauthorized: Admin privileges required.' };
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return { success: false, content: 'Please enter a valid message.' };
  }

  const response = await processAIRequest({
    role: 'ADMIN',
    userId: session.userId,
    prompt: prompt.trim(),
    conversationId,
  });

  return response;
}
