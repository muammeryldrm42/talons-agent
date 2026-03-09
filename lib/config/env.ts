import localSecrets from '@/config/local.secrets';

export type AppSecrets = {
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  COINGECKO_DEMO_API_KEY: string;
};

function normalize(value: string | undefined | null): string {
  return value?.trim() ?? '';
}

function getLocalSecrets(): AppSecrets {
  return {
    OPENAI_API_KEY: normalize(localSecrets.OPENAI_API_KEY),
    OPENAI_MODEL: normalize(localSecrets.OPENAI_MODEL) || 'gpt-5-mini',
    COINGECKO_DEMO_API_KEY: normalize(localSecrets.COINGECKO_DEMO_API_KEY),
  };
}

function getEnvSecrets(): AppSecrets {
  return {
    OPENAI_API_KEY: normalize(process.env.OPENAI_API_KEY),
    OPENAI_MODEL: normalize(process.env.OPENAI_MODEL) || 'gpt-5-mini',
    COINGECKO_DEMO_API_KEY: normalize(process.env.COINGECKO_DEMO_API_KEY),
  };
}

export function getServerConfig() {
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const envSecrets = getEnvSecrets();
  const local = getLocalSecrets();

  const merged: AppSecrets = {
    OPENAI_API_KEY: envSecrets.OPENAI_API_KEY || (!isProduction ? local.OPENAI_API_KEY : ''),
    OPENAI_MODEL: envSecrets.OPENAI_MODEL || (!isProduction ? local.OPENAI_MODEL : 'gpt-5-mini'),
    COINGECKO_DEMO_API_KEY:
      envSecrets.COINGECKO_DEMO_API_KEY || (!isProduction ? local.COINGECKO_DEMO_API_KEY : ''),
  };

  return {
    appName: 'Talons Agent',
    isProduction,
    usingLocalConfig: !isProduction && Boolean(local.OPENAI_API_KEY || local.COINGECKO_DEMO_API_KEY),
    hasOpenAIKey: Boolean(merged.OPENAI_API_KEY),
    hasCoinGeckoKey: Boolean(merged.COINGECKO_DEMO_API_KEY),
    model: merged.OPENAI_MODEL || 'gpt-5-mini',
    secrets: merged,
  };
}

export function requireOpenAIConfig() {
  const config = getServerConfig();

  if (!config.hasOpenAIKey) {
    throw new Error(
      'Missing OpenAI API key. Set OPENAI_API_KEY in Vercel environment variables or config/local.secrets.ts.',
    );
  }

  return config;
}
