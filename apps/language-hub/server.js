import express from 'express';
import cors from 'cors';
import * as googleTTS from 'google-tts-api';

const app = express();
const port = 3000;
const MAX_TEXT_LENGTH = 500;

app.use(cors());
app.use(express.json());

app.post('/api/speak', async (req, res) => {
    const { text, lang } = req.body ?? {};

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required' });
    }
    if (text.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({ error: `Text must be under ${MAX_TEXT_LENGTH} characters` });
    }

    const langCode = lang === 'spanish' ? 'es' : 'fr';

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
});

app.listen(port);
