export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = 10000,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init?.headers ?? {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText);
      throw new Error(`Request failed (${response.status}): ${message}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
