import { createSessionCookie, json } from '../_utils.js';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const { password } = body;

  if (!password || password !== env.ADMIN_PASSWORD) {
    return json({ ok: false, error: '비밀번호가 올바르지 않습니다.' }, 401);
  }

  const cookie = await createSessionCookie(env);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie });
}
