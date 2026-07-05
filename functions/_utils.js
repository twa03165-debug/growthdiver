// Shared helpers for Pages Functions.
// Filename starts with "_" so Cloudflare Pages does NOT treat this as a route.

const encoder = new TextEncoder();

async function hmac(key, message) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function createSessionCookie(env) {
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7일 유지
  const payload = `${expiry}`;
  const sig = await hmac(env.SESSION_SECRET, payload);
  const token = `${payload}.${sig}`;
  return `gd_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
}

export async function verifySession(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/gd_session=([^;]+)/);
  if (!match) return false;
  const token = decodeURIComponent(match[1]);
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = await hmac(env.SESSION_SECRET, payload);
  if (expected !== sig) return false;
  if (Date.now() > Number(payload)) return false;
  return true;
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}
