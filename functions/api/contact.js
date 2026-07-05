import { json } from '../_utils.js';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const { name, email, message, website } = body; // website = 허니팟(스팸봇용 숨김 필드)

  // 봇이 허니팟 필드를 채웠으면 조용히 성공 처리하고 저장은 하지 않음
  if (website) return json({ ok: true });

  if (!name || !email || !message) {
    return json({ error: '이름, 이메일, 문의 내용을 모두 입력해주세요.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: '올바른 이메일 형식이 아닙니다.' }, 400);
  }

  await env.DB.prepare(
    `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`
  ).bind(String(name).slice(0, 100), String(email).slice(0, 150), String(message).slice(0, 3000)).run();

  return json({ ok: true });
}
