import 'dotenv/config';
import { processAIRequest } from './engine';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runIntentRoutingVerification() {
  console.log('================================================================');
  console.log('🎯 SERVRIX AI - INTENT ROUTING & PROMPT ENGINEERING VERIFICATION');
  console.log('================================================================\n');

  console.log('----------------------------------------------------------------');
  console.log('PART 1: INFORMATIONAL / HOW-TO PROMPTS (EXPECTED: NO TOOL CALLS)');
  console.log('----------------------------------------------------------------');

  const informationalPrompts = [
    { role: 'CUSTOMER' as const, userId: 'cust-123', prompt: 'How do I cancel or reschedule a booking?', label: 'Cancel / Reschedule How-To' },
    { role: 'PUBLIC' as const, prompt: 'What is Servorix?', label: 'Servorix Overview' },
    { role: 'PUBLIC' as const, prompt: 'How do bookings work?', label: 'Booking Process Explanation' },
    { role: 'CUSTOMER' as const, userId: 'cust-123', prompt: 'What payment methods do you support?', label: 'Payment Methods FAQ' },
    { role: 'PUBLIC' as const, prompt: 'Can businesses join Servorix?', label: 'Business Registration FAQ' },
    { role: 'PUBLIC' as const, prompt: 'What is the cancellation policy?', label: 'Cancellation Policy FAQ' },
  ];

  for (let i = 0; i < informationalPrompts.length; i++) {
    const item = informationalPrompts[i];
    console.log(`\n👉 Prompt [${i + 1}/${informationalPrompts.length}]: "${item.prompt}" (${item.label})...`);
    if (i > 0) await delay(1500);

    const res = await processAIRequest({
      role: item.role,
      userId: item.userId,
      prompt: item.prompt,
    });

    console.log(`   Success: ${res.success}`);
    console.log(`   Response Content Preview:\n   "${res.content.substring(0, 150)}..."`);
  }

  console.log('\n----------------------------------------------------------------');
  console.log('PART 2: DATA & ANALYTICS PROMPTS (EXPECTED: TOOL CALLS EXECUTED)');
  console.log('----------------------------------------------------------------');

  const dataPrompts = [
    { role: 'CUSTOMER' as const, userId: 'cust-123', prompt: 'Show my previous bookings.', label: 'Customer Booking History' },
    { role: 'ADMIN' as const, userId: 'admin-123', prompt: 'Provide gross revenue and platform fee analytics.', label: 'Admin Metrics' },
    { role: 'PUBLIC' as const, prompt: 'Recommend a salon under Rs. 2,000.', label: 'Public Salon Discovery' },
  ];

  for (let i = 0; i < dataPrompts.length; i++) {
    const item = dataPrompts[i];
    console.log(`\n👉 Prompt [${i + 1}/${dataPrompts.length}]: "${item.prompt}" (${item.label})...`);
    if (i > 0) await delay(1500);

    const res = await processAIRequest({
      role: item.role,
      userId: item.userId,
      prompt: item.prompt,
    });

    console.log(`   Success: ${res.success}`);
    console.log(`   Response Content Preview:\n   "${res.content.substring(0, 150)}..."`);
  }

  console.log('\n================================================================');
  console.log('🎉 INTENT ROUTING VERIFICATION COMPLETE');
  console.log('================================================================');
}

runIntentRoutingVerification();
