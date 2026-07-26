import 'dotenv/config';
import { processAIRequest } from './engine';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runFullRuntimeVerification() {
  console.log('================================================================');
  console.log('🤖 SERVRIX AI SUITE - REAL RUNTIME VERIFICATION (GOOGLE AI STUDIO)');
  console.log('================================================================\n');

  const testCases = [
    {
      name: '🌍 Public Concierge Assistant',
      role: 'PUBLIC' as const,
      prompt: 'Recommend a salon for a haircut under Rs. 2,000.',
    },
    {
      name: '👤 Customer Booking Assistant',
      role: 'CUSTOMER' as const,
      userId: 'test-customer-id',
      prompt: 'Show my previous bookings.',
    },
    {
      name: '🏢 Owner AI Business Advisor',
      role: 'OWNER' as const,
      userId: 'test-owner-id',
      ownerPersona: 'BUSINESS' as const,
      prompt: 'How can I improve bookings this month?',
    },
    {
      name: '📊 Owner AI Analytics Intelligence',
      role: 'OWNER' as const,
      userId: 'test-owner-id',
      ownerPersona: 'ANALYTICS' as const,
      prompt: 'Summarize my booking analytics.',
    },
    {
      name: '🎨 Owner AI Marketing Studio',
      role: 'OWNER' as const,
      userId: 'test-owner-id',
      ownerPersona: 'MARKETING' as const,
      prompt: 'Write an Instagram promotion for my salon.',
    },
    {
      name: '👑 Admin Platform Intelligence',
      role: 'ADMIN' as const,
      userId: 'test-admin-id',
      prompt: 'Give me a platform summary.',
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`----------------------------------------------------------------`);
    console.log(`TEST [${i + 1}/${testCases.length}]: ${tc.name}`);
    console.log(`Prompt: "${tc.prompt}"`);

    if (i > 0) {
      console.log('⏳ Waiting 15s for rate limit pacing...');
      await delay(15000);
    }

    try {
      const res = await processAIRequest({
        role: tc.role,
        userId: tc.userId,
        ownerPersona: tc.ownerPersona,
        prompt: tc.prompt,
      });

      console.log(`\n📥 Formatter & Final Server Action Output:`);
      console.log(`- Success: ${res.success}`);
      console.log(`- Brand: ${res.brand}`);
      console.log(`- Timestamp: ${res.timestamp}`);
      console.log(`- Error: ${res.error || 'None'}`);
      console.log(`- Content:\n"${res.content}"`);
      console.log(`✅ TEST RESULT: ${res.success ? 'PASS' : 'FAIL'}\n`);
    } catch (err: any) {
      console.log(`❌ TEST RESULT: EXCEPTION (${err?.message || err})\n`);
    }
  }

  console.log('================================================================');
  console.log('VERIFICATION COMPLETE');
  console.log('================================================================');
}

runFullRuntimeVerification();
