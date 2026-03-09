import { searchCoins } from '@/lib/market/coingecko';
import { badRequest, serverError } from '@/lib/utils/http';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() ?? '';

    if (query.length < 2) {
      return badRequest('Query must be at least 2 characters long.');
    }

    const items = await searchCoins(query);
    return Response.json({ items });
  } catch (error) {
    return serverError('Failed to search coins.', error instanceof Error ? error.message : undefined);
  }
}
