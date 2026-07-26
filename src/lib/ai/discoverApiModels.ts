import 'dotenv/config';
import { getApiKey } from './provider';

async function fetchGoogleAIStudioModels() {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ Missing GEMINI_API_KEY');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  console.log('Querying Google AI Studio API for available models...');

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ HTTP ${res.status}: ${errText}`);
      return;
    }

    const data = await res.json();
    const models = data.models || [];
    console.log(`\nFound ${models.length} available models for this API Key:\n`);

    const generateModels = models
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => ({
        name: m.name.replace('models/', ''),
        displayName: m.displayName,
        description: m.description,
      }));

    generateModels.forEach((m: any, idx: number) => {
      console.log(`${idx + 1}. Name: "${m.name}" | Display: "${m.displayName}"`);
    });

    return generateModels;
  } catch (err: any) {
    console.error('❌ Network error querying model list:', err?.message || err);
  }
}

fetchGoogleAIStudioModels();
