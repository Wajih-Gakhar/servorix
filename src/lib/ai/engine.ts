import { generateText } from 'ai';
import { providerManager } from './providerManager';
import { validateAIRequest, AIRole } from './guard';
import { getSystemPrompt, OwnerPersona } from './registry';
import { buildAIContext } from './context';
import { formatAIResponse, formatAIErrorResponse, FormattedAIResponse } from './formatter';
import { logAIOperation } from './logger';
import { publicTools, customerTools, ownerTools, adminTools } from './tools';
import { AI_CONFIG } from './config';
import { prisma } from '@/lib/prisma';
import { checkLocalRateLimit } from './rateLimiter';
import { getCachedPublicResponse, setCachedPublicResponse } from './cache';

export interface AIServiceRequest {
  role: AIRole;
  userId?: string;
  prompt: string;
  ownerPersona?: OwnerPersona;
  conversationId?: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function categorizeError(errorMsg: string): { category: string; userFriendlyMsg: string } {
  const msg = errorMsg.toLowerCase();

  if (msg.includes('missing api key') || msg.includes('api_key_missing')) {
    return {
      category: 'MISSING_API_KEY',
      userFriendlyMsg: 'Servorix AI configuration error: API key is not configured.',
    };
  }
  if (msg.includes('invalid api key') || msg.includes('unauthorized') || msg.includes('api_key_invalid') || msg.includes('401')) {
    return {
      category: 'INVALID_API_KEY',
      userFriendlyMsg: 'Servorix AI authentication failed. Please check provider credentials.',
    };
  }
  if (msg.includes('rate limit') || msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted')) {
    return {
      category: 'RATE_LIMIT_EXCEEDED',
      userFriendlyMsg: `${AI_CONFIG.brandEmoji} Servorix AI is temporarily busy because all available AI providers have reached their free-tier limits. Please try again in about one minute.`,
    };
  }
  if (msg.includes('model not found') || msg.includes('invalid model') || msg.includes('404')) {
    return {
      category: 'INVALID_MODEL',
      userFriendlyMsg: 'Servorix AI model configuration error.',
    };
  }
  if (msg.includes('timeout') || msg.includes('econnreset') || msg.includes('fetch failed')) {
    return {
      category: 'NETWORK_FAILURE',
      userFriendlyMsg: 'Servorix AI experienced a connection timeout. Please try again.',
    };
  }

  return {
    category: 'GENERAL_ERROR',
    userFriendlyMsg: 'Servorix AI is currently experiencing high demand. Please try again in a few moments.',
  };
}

/**
 * Recovers empty LLM text responses after successful tool execution by building a concise natural language summary
 */
function synthesizeToolSummary(toolName: string, resultData: any): string {
  if (!resultData) return 'Information retrieved successfully.';

  if (toolName === 'getPlatformOverview') {
    const grossRev = (resultData.totalGrossRevenue || 0).toLocaleString();
    const platFees = (resultData.totalPlatformFees || 0).toLocaleString();
    return `Here is your platform summary:\n• Total Users: ${resultData.totalUsers || 0}\n• Total Businesses: ${resultData.totalBusinesses || 0}\n• Total Bookings: ${resultData.totalBookings || 0}\n• Gross Revenue: Rs. ${grossRev}\n• Platform Fee Revenue: Rs. ${platFees}`;
  }

  if (toolName === 'getOwnerBusinessSummary' && Array.isArray(resultData)) {
    if (resultData.length === 0) return 'You currently have no registered businesses on record.';
    return resultData
      .map(
        (b) =>
          `• Business: "${b.name}" (${b.category}) | Bookings: ${b.totalBookings} | Net Revenue: Rs. ${(b.totalRevenue || 0).toLocaleString()} | Rating: ${b.rating || 'N/A'}`
      )
      .join('\n');
  }

  if (toolName === 'getCustomerAppointments' && Array.isArray(resultData)) {
    if (resultData.length === 0) return 'You currently have no past or upcoming bookings on record.';
    return resultData
      .map((a) => `• Service: ${a.service?.name} at ${a.business?.name} on ${a.date} (${a.status})`)
      .join('\n');
  }

  if (toolName === 'searchBusinesses' && Array.isArray(resultData)) {
    if (resultData.length === 0) return 'No matching businesses found for your query.';
    return resultData
      .map(
        (b) =>
          `• ${b.name} (${b.category} in ${b.city}) - Services starting from Rs. ${b.services?.[0]?.price || 'N/A'}`
      )
      .join('\n');
  }

  return JSON.stringify(resultData, null, 2);
}

export async function processAIRequest(
  request: AIServiceRequest
): Promise<FormattedAIResponse> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // 1. Check Public Response Cache
  if (request.role === 'PUBLIC') {
    const cached = getCachedPublicResponse(request.prompt);
    if (cached) {
      logAIOperation({
        timestamp,
        role: request.role,
        provider: AI_CONFIG.activeProvider,
        model: AI_CONFIG.modelName,
        responseTimeMs: Date.now() - startTime,
        success: true,
        cacheStatus: 'HIT',
        rateLimiterStatus: 'BYPASS' as any,
        retryCount: 0,
      });
      return cached;
    }
  }

  // 2. AI Guard Security & RBAC Validation
  const guardCheck = validateAIRequest(
    { userId: request.userId, role: request.role },
    request.role,
    { prompt: request.prompt }
  );

  if (!guardCheck.allowed) {
    logAIOperation({
      timestamp,
      role: request.role,
      persona: request.ownerPersona,
      provider: AI_CONFIG.activeProvider,
      model: AI_CONFIG.modelName,
      responseTimeMs: Date.now() - startTime,
      success: false,
      cacheStatus: 'MISS',
      rateLimiterStatus: 'PASS',
      retryCount: 0,
      errorCategory: 'SECURITY_GUARD_REJECT',
      error: guardCheck.error,
    });
    return formatAIErrorResponse(
      guardCheck.error || 'Access Denied: AI Request rejected by Security Guard.',
      'SECURITY_GUARD_REJECT'
    );
  }

  // 3. Local Rate Limiter Check
  const rateLimitCheck = await checkLocalRateLimit();
  let rateLimiterStatus: 'PASS' | 'DELAYED' = 'PASS';
  if (!rateLimitCheck.allowed && rateLimitCheck.waitTimeMs > 0) {
    rateLimiterStatus = 'DELAYED';
    await delay(Math.min(rateLimitCheck.waitTimeMs, 10000));
  }

  // 4. Select Prompt, Context Summary, Tools
  const systemPrompt = getSystemPrompt(request.role, request.ownerPersona);
  const contextSummary = await buildAIContext(
    request.role,
    request.userId,
    request.ownerPersona
  );

  let activeTools: any = publicTools;
  if (request.role === 'CUSTOMER') activeTools = customerTools;
  if (request.role === 'OWNER') activeTools = ownerTools;
  if (request.role === 'ADMIN') activeTools = adminTools;

  const fullSystemMessage = `${systemPrompt}\n\n${contextSummary}`;

  // 5. Multi-Key Failover Loop via ProviderManager
  const poolSize = providerManager.getPoolSize();
  const maxRetries = Math.max(1, poolSize);
  let attempts = 0;
  let lastError: any = null;

  while (attempts < maxRetries) {
    const entry = providerManager.getNextHealthyProvider();
    if (!entry) {
      console.warn('[Servorix AI Engine Warning] All providers in pool are in COOLDOWN or unavailable.');
      break;
    }

    attempts++;
    try {
      console.log(`[Servorix AI Engine] Attempt ${attempts}/${maxRetries} using Provider #${entry.keyIndex} (${entry.maskedKey})...`);
      const modelInstance = entry.provider(AI_CONFIG.modelName);

      const res: any = await generateText({
        model: modelInstance,
        system: fullSystemMessage,
        prompt: request.prompt,
        tools: activeTools,
        maxSteps: 3,
      } as any);

      // Task 1 Instrumentation & Debug Logs
      console.log('========== ENGINE DEBUG ==========');
      console.log(`Provider: #${entry.keyIndex} (${entry.maskedKey})`);
      console.log(`Model: ${AI_CONFIG.modelName}`);
      console.log(`result.text: "${res.text || ''}"`);
      console.log(`finishReason: "${res.finishReason}"`);
      console.log(`steps count: ${res.steps?.length || 0}`);
      console.log(`toolCalls count: ${res.toolCalls?.length || 0}`);

      // Inspect SDK Response Structure for text
      let finalContent = res.text || '';
      if (!finalContent && res.steps && Array.isArray(res.steps)) {
        for (const step of res.steps) {
          if (step.text && step.text.trim()) {
            finalContent += (finalContent ? '\n\n' : '') + step.text.trim();
          }
        }
      }

      // Empty Response Recovery: Extract tool output supporting both toolResult.output and toolResult.result
      if (!finalContent && res.steps && Array.isArray(res.steps)) {
        for (const step of res.steps) {
          if (step.toolResults && Array.isArray(step.toolResults)) {
            for (const tr of step.toolResults) {
              const toolOutput = tr.output ?? tr.result;
              console.log(`[Engine Recovery] Extracting tool output from "${tr.toolName}"...`, toolOutput);
              const summary = synthesizeToolSummary(tr.toolName, toolOutput);
              finalContent += (finalContent ? '\n\n' : '') + summary;
            }
          }
        }
      }

      // Format Response
      let formatted = formatAIResponse(finalContent);

      // If still empty after recovery, provide safe branded default without triggering provider pool failover
      if (!formatted.success) {
        console.warn(`[Engine Task 4] Provider #${entry.keyIndex} HTTP 200 succeeded but text is empty. Applying fallback recovery.`);
        formatted = formatAIResponse('Servorix AI has processed your request based on platform system context.');
      }

      // HTTP 200 Provider Success -> DO NOT RETRY OTHER PROVIDERS IN POOL!
      providerManager.markProviderSuccess(entry.keyIndex);

      if (request.role === 'PUBLIC') {
        setCachedPublicResponse(request.prompt, formatted);
      }

      // Persist Conversation History
      if (request.conversationId || request.userId) {
        try {
          let convId = request.conversationId;
          if (!convId) {
            const conv = await prisma.aIConversation.create({
              data: {
                userId: request.userId || null,
                role: request.role,
              },
            });
            convId = conv.id;
          }

          await prisma.aIMessage.createMany({
            data: [
              { conversationId: convId, role: 'user', content: request.prompt },
              { conversationId: convId, role: 'assistant', content: formatted.content },
            ],
          });
        } catch (err) {
          console.error('Failed to persist AI conversation:', err);
        }
      }

      // Telemetry Log
      logAIOperation({
        timestamp,
        role: request.role,
        persona: request.ownerPersona,
        provider: `${AI_CONFIG.activeProvider} #${entry.keyIndex}`,
        model: AI_CONFIG.modelName,
        responseTimeMs: Date.now() - startTime,
        success: true,
        cacheStatus: 'MISS',
        rateLimiterStatus,
        retryCount: attempts - 1,
        toolCalls: res.toolCalls ? res.toolCalls.map((t: any) => t.toolName) : [],
      });

      return formatted;
    } catch (error: any) {
      lastError = error;
      const rawError = error?.message || String(error);
      const isRateLimit =
        rawError.toLowerCase().includes('rate limit') ||
        rawError.includes('429') ||
        rawError.includes('quota') ||
        rawError.includes('resource_exhausted') ||
        rawError.includes('503');

      if (isRateLimit) {
        console.warn(`[Servorix AI Engine] Provider #${entry.keyIndex} hit 429/Quota error. Marking COOLDOWN (60s)...`);
        providerManager.markProviderCooldown(entry.keyIndex, 60_000);
      }
    }
  }

  // All providers in pool failed due to genuine API exceptions
  const responseTimeMs = Date.now() - startTime;
  const rawError = lastError?.message || String(lastError);
  console.error(`[Servorix AI Engine Raw Exception] Pool exhausted. Last error:`, rawError);

  const { category, userFriendlyMsg } = categorizeError(rawError);

  logAIOperation({
    timestamp,
    role: request.role,
    persona: request.ownerPersona,
    provider: AI_CONFIG.activeProvider,
    model: AI_CONFIG.modelName,
    responseTimeMs,
    success: false,
    cacheStatus: 'MISS',
    rateLimiterStatus,
    retryCount: attempts,
    errorCategory: category,
    error: rawError,
  });

  return formatAIErrorResponse(userFriendlyMsg, category);
}
