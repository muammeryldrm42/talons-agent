import { analyzeCoin } from '@/lib/ai/analyze-coin';
import { applyRateLimit } from '@/lib/rate-limit/memory';
import { analyzeRequestSchema } from '@/lib/schemas/api';
import { getClientIp, badRequest, serverError } from '@/lib/utils/http';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const limiter = applyRateLimit(getClientIp(request));

    if (!limiter.ok) {
      return Response.json(
        {
          error: 'Too many analysis requests. Please wait a moment and try again.',
          resetAt: new Date(limiter.resetAt).toISOString(),
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = analyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest('Invalid analysis payload.', parsed.error.flatten());
    }

    const result = await analyzeCoin(parsed.data);

    return Response.json({
      market: result.market,
      analysis: result.analysis,
    });
  } catch (error) {
    return serverError(
      'Analysis failed. Check your OpenAI key and try again.',
      error instanceof Error ? error.message : undefined,
    );
  }
}
