'use server';

import { processAIRequest } from '@/lib/ai/engine';

export async function sendPublicAIMessage(prompt: string, conversationId?: string) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return { success: false, content: 'Please enter a valid message.' };
  }

  const response = await processAIRequest({
    role: 'PUBLIC',
    prompt: prompt.trim(),
    conversationId,
  });

  return response;
}
