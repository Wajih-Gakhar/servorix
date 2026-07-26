import { providerManager, ProviderPoolEntry } from './providerManager';
import { AI_CONFIG } from './config';

export { providerManager };

export function getApiKey(): string {
  const providerEntry = providerManager.getNextHealthyProvider();
  if (providerEntry) {
    return providerEntry.maskedKey;
  }
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
}

// Log startup status
console.log(
  `[Servorix AI Provider] Delegating to ProviderManager | Pool Size: ${providerManager.getPoolSize()} | Primary Model: "${AI_CONFIG.modelName}" | Fallback: "${AI_CONFIG.fallbackModelName}"`
);

export function getAIModelWithEntry(overrideModel?: string): { model: any; entry: ProviderPoolEntry | null } {
  const entry = providerManager.getNextHealthyProvider();
  const modelName = overrideModel || AI_CONFIG.modelName;

  if (!entry) {
    console.warn('[Servorix AI Provider Error] All providers in pool are in COOLDOWN or empty.');
    return { model: null as any, entry: null };
  }

  const modelInstance = entry.provider(modelName);
  return { model: modelInstance, entry };
}

export function getAIModel(overrideModel?: string): any {
  const { model } = getAIModelWithEntry(overrideModel);
  return model;
}

export function getFallbackAIModel(): any {
  return getAIModel(AI_CONFIG.fallbackModelName);
}
