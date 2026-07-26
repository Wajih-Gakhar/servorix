import 'dotenv/config';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { providerManager } from './providerManager';
import { AI_CONFIG } from './config';

async function runHandoffInspection() {
  console.log('================================================================');
  console.log('🔬 SERVRIX AI - TOOL RESULT HANDOFF DEEP DIAGNOSTICS');
  console.log('================================================================\n');

  const entry = providerManager.getNextHealthyProvider();
  if (!entry) {
    console.error('❌ No healthy provider available in pool.');
    return;
  }

  // Skip Provider #1 if invalid
  let activeEntry = entry;
  if (activeEntry.keyIndex === 1) {
    providerManager.markProviderCooldown(1, 3600_000);
    activeEntry = providerManager.getNextHealthyProvider() || entry;
  }

  console.log(`Using Provider #${activeEntry.keyIndex} (${activeEntry.maskedKey})...\n`);

  const diagnosticAdminTools = {
    getPlatformOverview: tool({
      description: 'Get platform-wide high-level metrics for admin dashboards.',
      parameters: z.object({}),
      execute: async () => {
        const [userCount, businessCount, bookingCount, totalPayments] = await Promise.all([
          prisma.user.count(),
          prisma.business.count(),
          prisma.appointment.count(),
          prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true, platformFee: true },
          }),
        ]);

        const toolReturnValue = {
          totalUsers: userCount,
          totalBusinesses: businessCount,
          totalBookings: bookingCount,
          totalGrossRevenue: totalPayments._sum.amount || 0,
          totalPlatformFees: totalPayments._sum.platformFee || 0,
        };

        console.log('\n===== TASK 2: TOOL RETURN VALUE =====');
        console.dir(toolReturnValue, { depth: null });
        console.log('=====================================\n');

        return toolReturnValue;
      },
    } as any),
  };

  try {
    console.log('Executing generateText() with getPlatformOverview()...\n');
    const res: any = await generateText({
      model: activeEntry.provider(AI_CONFIG.modelName),
      system: '[SYSTEM CONTEXT - ADMIN PORTAL]\nTotal Users: 5\nTotal Registered Businesses: 2',
      prompt: 'Provide gross revenue and platform fee analytics.',
      tools: diagnosticAdminTools,
      maxSteps: 3,
    } as any);

    console.log('===== TASK 3: ENTIRE SDK GENERATE_TEXT RESPONSE =====');
    console.dir(res, { depth: null });
    console.log('====================================================\n');

    console.log('===== TASK 4 & 5: STEPS & NESTED PROPERTY INSPECTION =====');
    if (res.steps && Array.isArray(res.steps)) {
      res.steps.forEach((step: any, idx: number) => {
        console.log(`\n--- STEP [${idx}] ---`);
        console.dir(step, { depth: null });

        if (step.toolCalls) {
          console.log(`\nstep[${idx}].toolCalls:`, step.toolCalls);
        }
        if (step.toolResults) {
          console.log(`\nstep[${idx}].toolResults:`, step.toolResults);
        }
      });
    } else {
      console.log('res.steps is absent or not an array.');
    }
    console.log('====================================================\n');
  } catch (err: any) {
    console.error('❌ Exception during SDK handoff inspection:', err);
  }
}

runHandoffInspection();
