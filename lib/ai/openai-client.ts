import OpenAI from 'openai';
import { requireOpenAIConfig } from '@/lib/config/env';

let client: OpenAI | null = null;

export function getOpenAIClient() {
  if (client) return client;

  const config = requireOpenAIConfig();
  client = new OpenAI({
    apiKey: config.secrets.OPENAI_API_KEY,
  });

  return client;
}
