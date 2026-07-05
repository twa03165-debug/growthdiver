import { verifySession, json } from '../../_utils.js';

export async function onRequestGet({ params, env, request }) {
  const post = await env.DB.prepare(`SELECT * FROM posts WHERE id = ?`).bind(params.id).first();
  if (!post) return json({ error: 'not found' }, 404);

  if (post.status !== 'published') {
    const authed = await verifySession(request, env);
    if (!authed) return json({ error: 'not found' }, 404);
  }
  return json({ post });
}

export async function onRequestPut({ params, request, env }) {
  const authed = await verifySession(request, env);
  if (!authed) return json({ error: '인증이 필요합니다.' }, 401);

  const body = await request.json().catch(() => ({}));
  const { title, category, excerpt, content, status } = body;
  if (!title || !content) return json({ error: '제목과 내용은 필수입니다.' }, 400);

  await env.DB.prepare(
    `UPDATE posts SET title=?, category=?, excerpt=?, content=?, status=?, updated_at=datetime('now') WHERE id=?`
  ).bind(title, category || '', excerpt || '', content, status || 'draft', params.id).run();

  return json({ ok: true });
}

export async function onRequestDelete({ params, request, env }) {
  const authed = await verifySession(request, env);
  if (!authed) return json({ error: '인증이 필요합니다.' }, 401);

  await env.DB.prepare(`DELETE FROM posts WHERE id=?`).bind(params.id).run();
  return json({ ok: true });
}
