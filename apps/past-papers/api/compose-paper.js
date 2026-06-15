// Vercel serverless function: POST /api/compose-paper (production).
// Same logic as the dev Express route, but source PDFs are fetched from R2
// over HTTP (the function has no local disk). Requires these env vars in the
// Vercel project: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_R2_PUBLIC_URL.

import { handleCompose } from '../server/compose-handler.js';
import { createR2Loader } from '../server/loaders.js';

// Composition can take a while for large selections; raise the cap (Vercel
// clamps to the plan's max).
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { status, body } = await handleCompose(req.body ?? {}, createR2Loader);
  res.status(status).json(body);
}
