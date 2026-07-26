import 'dotenv/config';
import { processAIRequest } from './engine';
import { providerManager } from './providerManager';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runFinalFixVerification() {
  console.log('================================================================');
  console.log('🎯 SERVRIX AI - FINAL ROOT CAUSE VERIFICATION & REGRESSION SUITE');
  console.log('================================================================\n');

  // Task 7 Scenario C Verification: Admin AI Prompt
  console.log('----------------------------------------------------------------');
  console.log('TASK 7 SCENARIO C — ADMIN AI PROMPT VERIFICATION');
  console.log('Prompt: "Provide gross revenue and platform fee analytics."');
  console.log('----------------------------------------------------------------');

  const adminRes = await processAIRequest({
    role: 'ADMIN',
    userId: 'admin-verify-user',
    prompt: 'Provide gross revenue and platform fee analytics.',
  });

  console.log('\n📥 Admin AI Output:');
  console.log(`- Success: ${adminRes.success}`);
  console.log(`- Brand: ${adminRes.brand}`);
  console.log(`- Error: ${adminRes.error || 'None'}`);
  console.log(`- Content:\n"${adminRes.content}"`);

  console.log('\n🔍 Provider Pool Health Status after Admin Prompt:');
  const healthAfterAdmin = providerManager.getProviderHealth();
  console.table(healthAfterAdmin);

  // Task 8 — Regression Testing of All 6 AI Assistants
  console.log('\n----------------------------------------------------------------');
  console.log('TASK 8 — REGRESSION TESTING OF ALL 6 ASSISTANTS');
  console.log('----------------------------------------------------------------');

  const testPrompts = [
    { role: 'PUBLIC' as const, prompt: 'Recommend a salon for a haircut under Rs. 2,000.', label: 'Public Concierge' },
    { role: 'CUSTOMER' as const, userId: 'c1', prompt: 'Show my previous bookings.', label: 'Customer Assistant' },
    { role: 'OWNER' as const, userId: 'o1', ownerPersona: 'BUSINESS' as const, prompt: 'How can I improve bookings?', label: 'Business Advisor' },
    { role: 'OWNER' as const, userId: 'o1', ownerPersona: 'ANALYTICS' as const, prompt: 'Summarize my booking analytics.', label: 'Analytics Intelligence' },
    { role: 'OWNER' as const, userId: 'o1', ownerPersona: 'MARKETING' as const, prompt: 'Write an Instagram promotion.', label: 'Marketing Studio' },
    { role: 'ADMIN' as const, userId: 'a1', prompt: 'Provide gross revenue and platform fee analytics.', label: 'Admin Intelligence' },
  ];

  for (let i = 0; i < testPrompts.length; i++) {
    const tp = testPrompts[i];
    console.log(`\n👉 Testing Assistant [${i + 1}/6]: ${tp.label}...`);
    if (i > 0) await delay(2000);

    try {
      const res = await processAIRequest({
        role: tp.role,
        userId: tp.userId,
        ownerPersona: tp.ownerPersona,
        prompt: tp.prompt,
      });

      console.log(`   Result: ${res.success ? 'PASS ✅' : 'FAIL ❌'} | Content: "${res.content.substring(0, 70)}..."`);
    } catch (err: any) {
      console.log(`   Result: EXCEPTION ❌ (${err?.message || err})`);
    }
  }

  console.log('\n================================================================');
  console.log('🎉 REGRESSION & VERIFICATION COMPLETE');
  console.log('================================================================');
}

runFinalFixVerification();
