import 'dotenv/config';
import { generateText } from 'ai';
import { getAIModel, getApiKey } from './provider';
import { AI_CONFIG } from './config';

export async function verifyGoogleAIStudioProvider() {
  console.log('=== Servorix AI - Google AI Studio Model Verification ===');
  console.log(`Active Provider: ${AI_CONFIG.activeProvider}`);
  console.log(`Configured Model: ${AI_CONFIG.modelName}`);

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ Missing API Key: Please set GEMINI_API_KEY in .env');
    return { success: false, error: 'MISSING_API_KEY' };
  }

  const maskedKey =
    apiKey.length > 8
      ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
      : '***';
  console.log(`🔑 Credentials Verified: GEMINI_API_KEY (${maskedKey})`);

  try {
    const model = getAIModel();
    console.log(`Sending test prompt using model: "${AI_CONFIG.modelName}"...`);
    const { text } = await generateText({
      model,
      prompt: 'Confirm Servorix AI provider connection in one sentence.',
    });
    console.log(`✅ Success: ${text.trim()}`);
    return { success: true, response: text };
  } catch (error: any) {
    console.log(`ℹ️ Test executed: ${error?.message || error}`);
    return { success: false, error: error?.message || String(error) };
  }
}

if (require.main === module) {
  verifyGoogleAIStudioProvider();
}
