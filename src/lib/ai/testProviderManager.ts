import 'dotenv/config';
import { providerManager } from './providerManager';
import { processAIRequest } from './engine';

async function verifyProviderManager() {
  console.log('================================================================');
  console.log('⚡ SERVRIX AI - MULTI-KEY PROVIDER MANAGER VERIFICATION SUITE');
  console.log('================================================================\n');

  console.log('🔍 [1/4] Inspecting Initial Discovered Pool & Health...');
  const initialHealth = providerManager.getProviderHealth();
  console.log(`  Discovered Pool Size: ${providerManager.getPoolSize()} keys`);
  console.table(initialHealth);

  console.log('\n🔍 [2/4] Testing Round-Robin Load Balancing...');
  for (let i = 1; i <= Math.max(3, providerManager.getPoolSize() * 2); i++) {
    const providerEntry = providerManager.getNextHealthyProvider();
    if (providerEntry) {
      console.log(`  Request #${i} -> Routed to Provider #${providerEntry.keyIndex} (${providerEntry.maskedKey})`);
    } else {
      console.log(`  Request #${i} -> All providers in cooldown.`);
    }
  }

  console.log('\n🔍 [3/4] Testing Cooldown Policy & Recovery Logic...');
  if (providerManager.getPoolSize() > 0) {
    console.log('  Simulating HTTP 429 Quota Exceeded on Provider #1...');
    providerManager.markProviderCooldown(1, 3000); // 3 sec simulated cooldown
    const postCooldownHealth = providerManager.getProviderHealth();
    console.log(`  Provider #1 Status: ${postCooldownHealth[0]?.status} (Remaining: ${postCooldownHealth[0]?.cooldownRemainingSec}s)`);

    console.log('  Waiting 3.5s for cooldown expiration...');
    await new Promise((resolve) => setTimeout(resolve, 3500));
    const recoveredHealth = providerManager.getProviderHealth();
    console.log(`  Provider #1 Status after recovery: ${recoveredHealth[0]?.status}`);
  }

  console.log('\n🔍 [4/4] Executing Real AI Request through ProviderManager...');
  try {
    const res = await processAIRequest({
      role: 'PUBLIC',
      prompt: 'Summarize Servorix features in one sentence.',
    });
    console.log(`  Execution Success: ${res.success}`);
    console.log(`  Brand: ${res.brand}`);
    console.log(`  Content: "${res.content.substring(0, 70)}..."`);
  } catch (err: any) {
    console.log(`  Execution Exception: ${err?.message || err}`);
  }

  console.log('\n================================================================');
  console.log('🎉 PROVIDER MANAGER VERIFICATION COMPLETE');
  console.log('================================================================');
}

verifyProviderManager();
