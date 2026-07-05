import { verifySession, json } from '../../_utils.js';

export async function onRequestPatch({ params, request, env }) {
  const authed = await verifySession(request, env);
  if (!authed) return json({ error: '인증이 필요합니다.' }, 401);

  await env.DB.prepare(`UPDATE messages SET is_read = 1 WHERE id = ?`).bind(params.id).run();
  return json({ ok: true });
}

export async function onRequestDelete({ params, request, env }) {
  const authed = await verifySession(request, env);
  if (!authed) return json({ error: '인증이 필요합니다.' }, 401);

  await env.DB.prepare(`DELETE FROM messages WHERE id = ?`).bind(params.id).run();
  return json({ ok: true });
}
