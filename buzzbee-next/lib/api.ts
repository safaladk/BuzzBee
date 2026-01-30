type Json = Record<string, unknown>;

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

async function request<T>(path: string, options: RequestInit & { json?: Json } = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    body: options.json ? JSON.stringify(options.json) : options.body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = text;
    try {
      const data = JSON.parse(text);
      message = (data && (data.message as string)) || message;
    } catch {}
    throw new Error(message || `Request failed (${res.status})`);
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return (await res.text()) as unknown as T;
}

export const auth = {
  async signup(payload: { name: string; email: string; password: string; userType?: 'user' | 'organizer' }) {
    return request<{ user: { id: string; email: string; name: string } }>(
      '/auth/signup',
      { method: 'POST', json: payload }
    );
  },
  async login(payload: { email: string; password: string }) {
    return request<{ user: { id: string; email: string; name: string } }>(
      '/auth/login',
      { method: 'POST', json: payload }
    );
  },
  async me() {
    return request<{ user: { id: string; email: string; name: string } }>(
      '/auth/me',
      { method: 'GET' }
    );
  },
  async refresh() {
    return request<{ ok: boolean }>(
      '/auth/refresh',
      { method: 'POST' }
    );
  },
  async logout() {
    return request<{ ok: boolean }>(
      '/auth/logout',
      { method: 'POST' }
    );
  },
};
