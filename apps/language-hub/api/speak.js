import * as googleTTS from 'google-tts-api';

const MAX_TEXT_LENGTH = 500;
const VALID_LANG_CODES = ['es', 'fr'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, lang } = req.body ?? {};

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: `Text must be under ${MAX_TEXT_LENGTH} characters` });
  }

  const langCode = lang === 'spanish' ? 'es' : 'fr';
  if (!VALID_LANG_CODES.includes(langCode)) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  try {
    const audioBase64 = await googleTTS.getAudioBase64(text, {
      lang: langCode,
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    });
    res.json({ audio: audioBase64 });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
}
