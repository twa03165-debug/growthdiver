import { verifySession, json } from '../_utils.js';

export async function onRequestGet({ request, env }) {
  const authed = await verifySession(request, env);
  if (!authed) return json({ error: '인증이 필요합니다.' }, 401);

  const { results } = await env.DB.prepare(
    `SELECT * FROM messages ORDER BY created_at DESC`
  ).all();
  return json({ messages: results });
}
