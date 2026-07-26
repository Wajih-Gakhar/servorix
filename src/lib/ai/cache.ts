import { FormattedAIResponse } from './formatter';

interface CacheEntry {
  response: FormattedAIResponse;
  expiresAt: number;
}

const publicResponseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function normalizeKey(prompt: string): string {
  return prompt.trim().toLowerCase().replace(/[^\w\s]/gi, '');
}

export function getCachedPublicResponse(prompt: string): FormattedAIResponse | null {
  const key = normalizeKey(prompt);
  const entry = publicResponseCache.get(key);

  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    publicResponseCache.delete(key);
    return null;
  }

  return entry.response;
}

export function setCachedPublicResponse(prompt: string, response: FormattedAIResponse): void {
  if (!response.success) return; // Only cache successful responses

  const key = normalizeKey(prompt);
  publicResponseCache.set(key, {
    response,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}
