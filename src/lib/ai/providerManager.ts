import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { AI_CONFIG } from './config';

export interface ProviderPoolEntry {
  keyIndex: number;
  maskedKey: string;
  provider: any;
  modelName: string;
  status: 'HEALTHY' | 'COOLDOWN' | 'DISABLED';
  cooldownUntil: number;
  requestsServed: number;
  consecutiveFailures: number;
  totalFailures: number;
  totalSuccesses: number;
  lastUsed: number;
}

export class ProviderManager {
  private pool: ProviderPoolEntry[] = [];
  private roundRobinIndex: number = 0;

  constructor() {
    this.discoverAndInitializeKeys();
  }

  /**
   * Automatically discovers API keys from process.env:
   * GEMINI_API_KEY, GEMINI_API_KEY_1..10, GOOGLE_API_KEY_1..10
   */
  private discoverAndInitializeKeys(): void {
    const discoveredKeys: string[] = [];

    // Check primary standard env vars
    const primaryKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (primaryKey && primaryKey.trim()) {
      discoveredKeys.push(primaryKey.trim());
    }

    // Check numbered env vars (GEMINI_API_KEY_1..20, GOOGLE_API_KEY_1..20)
    for (let i = 1; i <= 20; i++) {
      const gKey = process.env[`GEMINI_API_KEY_${i}`] || process.env[`GOOGLE_API_KEY_${i}`];
      if (gKey && gKey.trim() && !discoveredKeys.includes(gKey.trim())) {
        discoveredKeys.push(gKey.trim());
      }
    }

    if (discoveredKeys.length === 0) {
      console.warn('[ProviderManager Warning] No API keys discovered in process.env. System will run in unauthenticated mode.');
    }

    this.pool = discoveredKeys.map((key, index) => {
      const maskedKey =
        key.length > 8
          ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
          : '***';

      return {
        keyIndex: index + 1,
        maskedKey,
        provider: createGoogleGenerativeAI({ apiKey: key }),
        modelName: AI_CONFIG.modelName,
        status: 'HEALTHY',
        cooldownUntil: 0,
        requestsServed: 0,
        consecutiveFailures: 0,
        totalFailures: 0,
        totalSuccesses: 0,
        lastUsed: 0,
      };
    });

    console.log(
      `[ProviderManager] Initialized multi-key pool with ${this.pool.length} discovered Google AI Studio API Key(s).`
    );
  }

  /**
   * Refreshes cooldown states for providers whose cooldown period has expired.
   */
  private updateProviderStatuses(): void {
    const now = Date.now();
    for (const entry of this.pool) {
      if (entry.status === 'COOLDOWN' && now >= entry.cooldownUntil) {
        entry.status = 'HEALTHY';
        entry.cooldownUntil = 0;
        entry.consecutiveFailures = 0;
        console.log(`[ProviderManager] Provider #${entry.keyIndex} (${entry.maskedKey}) cooldown expired. Restored to HEALTHY.`);
      }
    }
  }

  /**
   * Gets healthy providers count
   */
  public getHealthyCount(): number {
    this.updateProviderStatuses();
    return this.pool.filter((e) => e.status === 'HEALTHY').length;
  }

  /**
   * Selects next healthy provider using round-robin load balancing
   */
  public getNextHealthyProvider(): ProviderPoolEntry | null {
    this.updateProviderStatuses();
    const healthyEntries = this.pool.filter((e) => e.status === 'HEALTHY');

    if (healthyEntries.length === 0) {
      return null;
    }

    // Round-robin selection
    const selected = healthyEntries[this.roundRobinIndex % healthyEntries.length];
    this.roundRobinIndex = (this.roundRobinIndex + 1) % healthyEntries.length;
    selected.lastUsed = Date.now();
    return selected;
  }

  /**
   * Marks a provider into COOLDOWN (60 seconds) on HTTP 429 / Quota Error
   */
  public markProviderCooldown(keyIndex: number, cooldownMs: number = 60_000): void {
    const entry = this.pool.find((e) => e.keyIndex === keyIndex);
    if (entry) {
      entry.status = 'COOLDOWN';
      entry.cooldownUntil = Date.now() + cooldownMs;
      entry.consecutiveFailures++;
      entry.totalFailures++;
      console.warn(
        `[ProviderManager] Provider #${entry.keyIndex} (${entry.maskedKey}) entered COOLDOWN for ${cooldownMs / 1000}s.`
      );
    }
  }

  /**
   * Reports success for a provider
   */
  public markProviderSuccess(keyIndex: number): void {
    const entry = this.pool.find((e) => e.keyIndex === keyIndex);
    if (entry) {
      entry.requestsServed++;
      entry.totalSuccesses++;
      entry.consecutiveFailures = 0;
    }
  }

  /**
   * Returns current pool state for debugging / health dashboards
   */
  public getProviderHealth(): any[] {
    this.updateProviderStatuses();
    const now = Date.now();
    return this.pool.map((entry) => ({
      keyIndex: entry.keyIndex,
      maskedKey: entry.maskedKey,
      status: entry.status,
      cooldownRemainingSec:
        entry.status === 'COOLDOWN'
          ? Math.max(0, Math.ceil((entry.cooldownUntil - now) / 1000))
          : 0,
      requestsServed: entry.requestsServed,
      totalSuccesses: entry.totalSuccesses,
      totalFailures: entry.totalFailures,
    }));
  }

  /**
   * Total number of registered keys in pool
   */
  public getPoolSize(): number {
    return this.pool.length;
  }
}

// Global Singleton Instance
export const providerManager = new ProviderManager();
