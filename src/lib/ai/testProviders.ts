import 'dotenv/config';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { providerManager } from './providerManager';
import { publicTools, customerTools, ownerTools, adminTools } from './tools';
import { buildAIContext } from './context';
import { processAIRequest } from './engine';
import { AI_CONFIG } from './config';

async function runDeepDiagnostics() {
  console.log('================================================================');
  console.log('🔬 SERVRIX AI - DEEP DIAGNOSTICS & ROOT CAUSE ANALYSIS');
  console.log('================================================================\n');

  // TASK 2 — Individual Provider Health Check
  const discoveredKeys: string[] = [];
  const primaryKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (primaryKey && primaryKey.trim()) discoveredKeys.push(primaryKey.trim());
  for (let i = 1; i <= 20; i++) {
    const k = process.env[`GEMINI_API_KEY_${i}`] || process.env[`GOOGLE_API_KEY_${i}`];
    if (k && k.trim() && !discoveredKeys.includes(k.trim())) discoveredKeys.push(k.trim());
  }

  const providerHealthResults: any[] = [];

  for (let idx = 0; idx < discoveredKeys.length; idx++) {
    const key = discoveredKeys[idx];
    const maskedKey = key.length > 8 ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : '***';
    const provider = createGoogleGenerativeAI({ apiKey: key });

    const startTime = Date.now();
    try {
      const res = await generateText({
        model: provider(AI_CONFIG.modelName),
        prompt: 'Reply with only the word HEALTHY.',
      });

      const latency = Date.now() - startTime;
      providerHealthResults.push({
        index: idx + 1,
        maskedKey,
        status: 'SUCCESS',
        httpCode: 200,
        message: res.text.trim(),
        latencyMs: latency,
      });
    } catch (err: any) {
      const latency = Date.now() - startTime;
      const errorMsg = err?.message || String(err);
      const statusCode = err?.statusCode || (errorMsg.includes('429') ? 429 : 500);

      providerHealthResults.push({
        index: idx + 1,
        maskedKey,
        status: 'FAILED',
        httpCode: statusCode,
        message: errorMsg.substring(0, 150),
        latencyMs: latency,
      });
    }
  }

  console.log('\n📊 PROVIDER POOL HEALTH SUMMARY TABLE:');
  console.table(providerHealthResults);

  // TASK 3 — Tool Diagnostics
  const toolTests = [
    { name: 'searchBusinesses', fn: () => (publicTools.searchBusinesses as any).execute({ query: 'salon' }, { toolCallId: '1', messages: [] }) },
    { name: 'getCustomerAppointments', fn: () => (customerTools.getCustomerAppointments as any).execute({ customerId: 'test-cust' }, { toolCallId: '2', messages: [] }) },
    { name: 'getOwnerBusinessSummary', fn: () => (ownerTools.getOwnerBusinessSummary as any).execute({ ownerId: 'test-owner' }, { toolCallId: '3', messages: [] }) },
    { name: 'getPlatformOverview', fn: () => (adminTools.getPlatformOverview as any).execute({}, { toolCallId: '4', messages: [] }) },
  ];

  for (const t of toolTests) {
    const startTime = Date.now();
    try {
      const result = await t.fn();
      const latency = Date.now() - startTime;
      console.log(`✅ Tool "${t.name}": SUCCESS | Latency: ${latency}ms | Result:`, result);
    } catch (err: any) {
      console.log(`❌ Tool "${t.name}": FAILED | Exception: ${err?.message || err}`);
    }
  }

  // TASK 4 — Context Builder Diagnostics
  const contextTests = [
    { role: 'PUBLIC' as const, label: 'Public Portal' },
    { role: 'CUSTOMER' as const, label: 'Customer Portal', userId: 'test-cust-123' },
    { role: 'OWNER' as const, label: 'Owner Portal (Business)', userId: 'test-owner-123', ownerPersona: 'BUSINESS' as const },
    { role: 'ADMIN' as const, label: 'Admin Portal' },
  ];

  for (const ct of contextTests) {
    const startTime = Date.now();
    try {
      const summary = await buildAIContext(ct.role, ct.userId, ct.ownerPersona);
      const latency = Date.now() - startTime;
      console.log(`✅ Context "${ct.label}": SUCCESS | Size: ${summary.length} chars | Latency: ${latency}ms`);
    } catch (err: any) {
      console.log(`❌ Context "${ct.label}": FAILED | Exception: ${err?.message || err}`);
    }
  }

  // TASK 6 — Admin AI Investigation
  console.log('\n----------------------------------------------------------------');
  console.log('TASK 6 — ADMIN AI INVESTIGATION');
  console.log('Prompt: "Provide gross revenue and platform fee analytics."');
  console.log('----------------------------------------------------------------');

  const adminStartTime = Date.now();
  try {
    const adminRes = await processAIRequest({
      role: 'ADMIN',
      userId: 'admin-diag-user',
      prompt: 'Provide gross revenue and platform fee analytics.',
    });
    console.log(`Admin AI Execution Completed in ${Date.now() - adminStartTime}ms`);
    console.log(`- Success: ${adminRes.success}`);
    console.log(`- Brand: ${adminRes.brand}`);
    console.log(`- Error: ${adminRes.error || 'None'}`);
    console.log(`- Content:\n"${adminRes.content}"`);
  } catch (err: any) {
    console.log(`❌ Admin AI Execution Exception: ${err?.message || err}`);
  }
}

runDeepDiagnostics();
