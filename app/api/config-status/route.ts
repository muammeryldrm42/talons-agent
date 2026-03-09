import { getServerConfig } from '@/lib/config/env';

export async function GET() {
  const config = getServerConfig();

  return Response.json({
    appName: config.appName,
    isProduction: config.isProduction,
    usingLocalConfig: config.usingLocalConfig,
    hasOpenAIKey: config.hasOpenAIKey,
    hasCoinGeckoKey: config.hasCoinGeckoKey,
    model: config.model,
  });
}
