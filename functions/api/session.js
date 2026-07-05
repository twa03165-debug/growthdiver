import { verifySession, json } from '../_utils.js';

export async function onRequestGet({ request, env }) {
  const authenticated = await verifySession(request, env);
  return json({ authenticated });
}
