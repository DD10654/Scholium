import express from 'express';
import cors from 'cors';
import { composePdf } from './server/compose-pdf.js';

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// PDF composition endpoint
app.post('/api/compose-paper', async (req, res) => {
  try {
    const { selections, includeMarkScheme = true, randomize = false } = req.body || {};

    // Validate input
    if (!selections || typeof selections !== 'object' || Object.keys(selections).length === 0) {
      return res.status(400).json({
        error: 'selections is required and must be a non-empty object of {questionId: boolean}',
      });
    }

    // Extract selected question IDs
    const selectedIds = Object.entries(selections)
      .filter(([, selected]) => selected)
      .map(([id]) => id)
      .sort();

    if (selectedIds.length === 0) {
      return res.status(400).json({ error: 'No questions selected' });
    }

    // Randomize if requested
    let orderedIds = selectedIds;
    if (randomize) {
      orderedIds = selectedIds.sort(() => Math.random() - 0.5);
    }

    console.log(`Composing PDF with ${orderedIds.length} questions (includeMarkScheme: ${includeMarkScheme})`);

    // Compose PDF
    const { pdfBase64, metadata } = await composePdf(orderedIds, includeMarkScheme);

    res.json({
      pdfBase64,
      metadata,
    });
  } catch (error) {
    console.error('PDF composition error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      error: error.message || 'Failed to compose PDF',
      details: error.stack,
    });
  }
});

app.listen(port, () => {
  console.log(`Past Papers API server running on port ${port}`);
});
