import express from 'express';
import cors from 'cors';
import textToSpeech from '@google-cloud/text-to-speech';

const app = express();
const port = 3000;
const MAX_TEXT_LENGTH = 500;

app.use(cors());
app.use(express.json());

// Google Cloud Text-to-Speech auth. In hosted/serverless environments pass the
// service-account JSON inline via GOOGLE_APPLICATION_CREDENTIALS_JSON; locally
// you can instead point GOOGLE_APPLICATION_CREDENTIALS at the key file (the
// Application Default Credentials the client library picks up automatically).
const inlineCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
    : null;
const ttsClient = new textToSpeech.TextToSpeechClient(
    inlineCredentials ? { credentials: inlineCredentials } : undefined,
);

// Map the app's language label to a Google Cloud voice. Anything unrecognised
// falls back to French, matching the previous behaviour.
const VOICES = {
    spanish: { languageCode: 'es-ES', name: 'es-ES-Standard-A' },
    french: { languageCode: 'fr-FR', name: 'fr-FR-Standard-A' },
};

app.post('/api/speak', async (req, res) => {
    const { text, lang } = req.body ?? {};

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required' });
    }
    if (text.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({ error: `Text must be under ${MAX_TEXT_LENGTH} characters` });
    }

    const voice = VOICES[lang] ?? VOICES.french;

    try {
        const [response] = await ttsClient.synthesizeSpeech({
            input: { text },
            voice: { languageCode: voice.languageCode, name: voice.name },
            audioConfig: { audioEncoding: 'MP3' },
        });
        // audioContent is raw MP3 bytes; the client expects base64 to build a
        // data:audio/mp3;base64,... URL, so the response shape is unchanged.
        const audioBase64 = Buffer.from(response.audioContent).toString('base64');
        res.json({ audio: audioBase64 });
    } catch (error) {
        console.error('TTS error:', error);
        res.status(500).json({ error: 'Failed to generate audio' });
    }
});

app.listen(port);
