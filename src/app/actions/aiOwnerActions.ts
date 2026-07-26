'use server';

import { getSession } from '@/lib/auth';
import { processAIRequest } from '@/lib/ai/engine';
import { OwnerPersona } from '@/lib/ai/registry';

export async function sendOwnerAIMessage(
  prompt: string,
  persona: OwnerPersona = 'BUSINESS',
  conversationId?: string
) {
  const session = await getSession();
  if (!session || session.role !== 'OWNER') {
    return { success: false, content: 'Unauthorized: Owner access required.' };
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return { success: false, content: 'Please enter a valid message.' };
  }

  const response = await processAIRequest({
    role: 'OWNER',
    userId: session.userId,
    ownerPersona: persona,
    prompt: prompt.trim(),
    conversationId,
  });

  return response;
}
