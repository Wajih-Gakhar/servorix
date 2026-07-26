import 'dotenv/config';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getApiKey } from './provider';

async function discoverSupportedModels() {
  console.log('=== Servorix AI - Google AI Studio Model Discovery ===');
  const apiKey = getApiKey();
  const google = createGoogleGenerativeAI({ apiKey });

  const candidateModels = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash-lite',
    'gemini-2.0-pro-exp-02-05',
  ];

  const supported: string[] = [];

  for (const modelId of candidateModels) {
    try {
      console.log(`Testing model "${modelId}"...`);
      const { text } = await generateText({
        model: google(modelId),
        prompt: 'Ping Servorix AI model test.',
      });
      console.log(`  ✅ SUCCESS with "${modelId}": ${text.trim()}`);
      supported.push(modelId);
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.log(`  ❌ FAILED with "${modelId}": ${msg.substring(0, 150)}...`);
    }
  }

  console.log('\nSupported Models Summary:', supported);
}

discoverSupportedModels();
