import { verifySession, json } from '../_utils.js';

export async function onRequestGet({ request, env }) {
  const authed = await verifySession(request, env);
  const query = authed
    ? `SELECT * FROM posts ORDER BY created_at DESC`
    : `SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC`;
  const { results } = await env.DB.prepare(query).all();
  return json({ posts: results });
}

export async function onRequestPost({ request, env }) {
  const authed = await verifySession(request, env);
  if (!authed) return json({ error: '인증이 필요합니다.' }, 401);

  const body = await request.json().catch(() => ({}));
  const { title, category, excerpt, content, status } = body;
  if (!title || !content) return json({ error: '제목과 내용은 필수입니다.' }, 400);

  const result = await env.DB.prepare(
    `INSERT INTO posts (title, category, excerpt, content, status) VALUES (?, ?, ?, ?, ?)`
  ).bind(title, category || '', excerpt || '', content, status || 'draft').run();

  return json({ ok: true, id: result.meta.last_row_id });
}
