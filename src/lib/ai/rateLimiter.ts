// Lightweight sliding-window server-side rate limiter for AI requests
const requestTimestamps: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 4; // Stay comfortably under Google AI Studio free tier 5 RPM limit
const WINDOW_MS = 60 * 1000;

export async function checkLocalRateLimit(): Promise<{ allowed: boolean; waitTimeMs: number }> {
  const now = Date.now();
  
  // Clean timestamps older than window
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - WINDOW_MS) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    const oldest = requestTimestamps[0];
    const waitTimeMs = oldest + WINDOW_MS - now + 500;
    return { allowed: false, waitTimeMs };
  }

  requestTimestamps.push(now);
  return { allowed: true, waitTimeMs: 0 };
}
