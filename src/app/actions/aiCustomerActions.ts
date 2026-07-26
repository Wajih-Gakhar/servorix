'use server';

import { getSession } from '@/lib/auth';
import { processAIRequest } from '@/lib/ai/engine';

export async function sendCustomerAIMessage(prompt: string, conversationId?: string) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { success: false, content: 'Unauthorized: Please log in as a customer.' };
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return { success: false, content: 'Please enter a valid message.' };
  }

  const response = await processAIRequest({
    role: 'CUSTOMER',
    userId: session.userId,
    prompt: prompt.trim(),
    conversationId,
  });

  return response;
}
