import { getServerConfig } from '@/lib/config/env';

export async function GET() {
  const config = getServerConfig();

  return Response.json({
    status: 'ok',
    app: config.appName,
    model: config.model,
    timestamp: new Date().toISOString(),
  });
}
