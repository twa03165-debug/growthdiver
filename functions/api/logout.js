import { json } from '../_utils.js';

export async function onRequestPost() {
  return json({ ok: true }, 200, {
    'Set-Cookie': 'gd_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
  });
}
