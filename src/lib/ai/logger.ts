export interface AILogEntry {
  timestamp: string;
  role: string;
  persona?: string;
  provider: string;
  model: string;
  responseTimeMs: number;
  success: boolean;
  cacheStatus?: 'HIT' | 'MISS' | 'BYPASS';
  rateLimiterStatus?: 'PASS' | 'DELAYED' | 'REJECT';
  retryCount?: number;
  error?: string;
  errorCategory?: string;
  toolCalls?: string[];
}

export function logAIOperation(entry: AILogEntry) {
  const personaInfo = entry.persona ? ` (${entry.persona})` : '';
  const errorInfo = entry.error ? ` | Error: [${entry.errorCategory || 'General'}] ${entry.error}` : '';
  const toolsInfo = entry.toolCalls && entry.toolCalls.length > 0 ? ` | Tools: ${entry.toolCalls.join(', ')}` : '';
  const cacheInfo = ` | Cache: ${entry.cacheStatus || 'MISS'}`;
  const rateLimitInfo = ` | RateLimiter: ${entry.rateLimiterStatus || 'PASS'}`;
  const retryInfo = entry.retryCount ? ` | Retries: ${entry.retryCount}` : ' | Retries: 0';

  console.log(
    `[Servorix AI Log] ${entry.timestamp} | Role: ${entry.role}${personaInfo} | Provider: ${entry.provider} (${entry.model}) | Time: ${entry.responseTimeMs}ms | Success: ${entry.success}${cacheInfo}${rateLimitInfo}${retryInfo}${toolsInfo}${errorInfo}`
  );
}
