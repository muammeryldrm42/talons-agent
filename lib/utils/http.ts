export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }

  return request.headers.get('x-real-ip') ?? 'unknown';
}

export function badRequest(message: string, details?: unknown) {
  return Response.json(
    {
      error: message,
      details,
    },
    { status: 400 },
  );
}

export function serverError(message: string, details?: unknown) {
  return Response.json(
    {
      error: message,
      details,
    },
    { status: 500 },
  );
}
