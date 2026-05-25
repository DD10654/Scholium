# Past Papers: Individual Question Selection & PDF Composition - Implementation Guide

This guide covers the setup and deployment of the new Past Papers generation system.

## Overview

The Past Papers app now supports generating custom exam papers by selecting individual questions. The system consists of:

1. **Supabase Database** — Stores metadata for ~2,153 questions
2. **Supabase Storage** — Stores individual question/mark-scheme JPG files (~4,272 images)
3. **Express Server** — Composes PDFs from selected questions using pdfkit
4. **React Frontend** — Multi-step UI for subject/component/chapter/question selection

---

## Setup Steps

### Step 1: Create & Apply Database Migration

The migration creates the `questions_metadata` table.

**In Supabase SQL Editor:**
1. Navigate to https://app.supabase.com/project/YOUR_PROJECT/sql
2. Create a new query
3. Copy the contents of `database/migrations/20260520000000_questions_metadata.sql`
4. Run the query

**Expected result:** Table created with RLS policies enabled.

---

### Step 2: Import Question Metadata

The import script reads both CSV files and inserts them into Supabase.

**Prerequisites:**
- Python 3.8+
- `supabase-python` package (install with `pip install supabase-python`)
- `.env` file in `apps/past-papers/` with:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

**Run the import:**
```bash
cd /Users/aarav/Desktop/Educational\ Projects/React-Turborepo
python3 database/import_questions.py
```

**Expected result:**
```
Importing /Users/aarav/Desktop/Past Papers/.../Paper 2/questions_classified.csv...
  Inserted 100 rows
  Inserted 100 rows
  ...
✓ Completed
Verifying import...
✓ Total questions imported: 2153
Chapter distribution:
...
```

**Troubleshooting:**
- If you get "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", check that your `.env` file is in the correct directory
- If rows don't insert, check the Supabase SQL logs for constraint violations

---

### Step 3: Create Supabase Storage Bucket

Create a new public storage bucket for question images.

**In Supabase:**
1. Navigate to Storage section
2. Create new bucket: `past-papers-questions`
3. Set to "Public" (allow public read access)
4. Leave upload restrictions open for now

---

### Step 4: Upload Question JPG Files

Upload ~4,272 JPG files from the local directories to Supabase Storage.

**Prerequisites:**
- Same `.env` file as Step 2
- `node-dotenv` package (included via npm)
- Access to the local directories:
  - `/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/Paper 2/dist/topical-questions/`
  - `/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/Paper 4/dist/topical-questions/`

**Run the upload:**
```bash
cd /Users/aarav/Desktop/Educational\ Projects/React-Turborepo
node database/upload-questions.js
```

**Expected output:**
```
🚀 Starting JPG upload to Supabase Storage...

📁 Processing: /Users/aarav/Desktop/Past Papers/.../Paper 2/dist/topical-questions/
Found 1198 JPG files
✅ P2-Q001-QP.jpg
✅ P2-Q001-MS.jpg
...
   ... 50/1198 processed
...
📊 Upload Summary:
   ✅ Uploaded: 4272
   ⏭️  Skipped: 0
   ❌ Errors: 0
   📈 Total: 4272

✨ Upload complete!
```

**Troubleshooting:**
- If uploads are slow, the script is rate-limited by Supabase. Let it run in the background
- If you see "already exists" for all files, the bucket may already have files. You can safely re-run (it will skip existing files)
- Check bucket storage usage in Supabase dashboard to verify files were uploaded

---

### Step 5: Test the Implementation

#### A. Test Database Query

In Supabase SQL Editor, verify the data:
```sql
SELECT COUNT(*), chapter_num 
FROM questions_metadata 
GROUP BY chapter_num 
ORDER BY chapter_num;

-- Should show ~90 questions per chapter across 24 chapters
```

#### B. Test Express Server

Start the dev servers:
```bash
cd /Users/aarav/Desktop/Educational\ Projects/React-Turborepo
pnpm dev
```

In a new terminal, test the API:
```bash
curl -X POST http://localhost:3000/api/compose-paper \
  -H "Content-Type: application/json" \
  -d '{
    "selections": {
      "P2-Q001": true,
      "P2-Q002": true,
      "P2-Q003": true
    },
    "includeMarkScheme": true,
    "randomize": false
  }'
```

**Expected result:**
```json
{
  "pdfBase64": "JVBERi0xLjQKJeLjz9...",
  "metadata": {
    "totalQuestions": 3,
    "totalPages": 6,
    "includeMarkScheme": true
  }
}
```

#### C. Test Frontend UI

Open http://localhost:5174/generate in your browser:

1. **Step 1:** Select "0607 (International Mathematics)"
2. **Step 2:** Select "Paper 2" or "Paper 4"
3. **Step 3:** Click on Chapter 1-24 (chapter buttons appear)
4. **Step 4:** See individual questions listed

   - Toggle 3-5 questions
   - Click "Select All" or "Clear All"
   - Notice the summary updates

5. **Options & Generate:**
   - Check "Mark Scheme" and "Randomize Order" options
   - Click "Generate & Download"
   - A PDF should download with today's date in the filename

#### D. Verify PDF Content

Open the downloaded PDF in any PDF viewer. It should contain:
- The selected question images (one per page)
- Optionally, mark scheme images after all questions
- Images in the correct order (or randomized if toggled)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Frontend)                     │
│  GeneratePaperPage.tsx                                  │
│  - Subject/Component/Chapter/Question selection         │
│  - Summary preview                                       │
│  - Download trigger                                      │
└──────────────────────┬──────────────────────────────────┘
                       │ POST /api/compose-paper
                       │ (questionIds, options)
                       ↓
┌──────────────────────────────────────────────────────────┐
│            Express Server (Node.js)                      │
│  apps/past-papers/server.js                             │
│  POST /api/compose-paper endpoint                       │
│  ↓                                                       │
│  server/compose-pdf.js                                  │
│  - Download JPGs from Supabase Storage                  │
│  - Compose PDF with pdfkit                              │
│  - Return base64 + metadata                             │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ↓                             ↓
┌──────────────────────┐    ┌──────────────────────┐
│  Supabase Storage    │    │  Supabase Database   │
│  past-papers-        │    │  questions_metadata  │
│  questions bucket    │    │  - id (P2-Q001, ...) │
│  - P2-Q001-QP.jpg    │    │  - chapter_num       │
│  - P2-Q001-MS.jpg    │    │  - paper             │
│  - ... (4,272 files) │    │  - sub_topic         │
│                      │    │  - y-coordinates     │
└──────────────────────┘    └──────────────────────┘
```

---

## File Structure

**New/Modified Files:**

```
database/
├── migrations/
│   └── 20260520000000_questions_metadata.sql  [NEW]
├── import_questions.py                        [NEW]
└── upload-questions.js                        [NEW]

apps/past-papers/
├── server.js                                  [NEW]
├── server/
│   └── compose-pdf.js                        [NEW]
├── .env.example                              [MODIFIED]
├── vercel.json                               [MODIFIED]
├── package.json                              [MODIFIED]
├── src/
│   ├── lib/
│   │   └── papers.ts                         [MODIFIED]
│   └── pages/
│       └── GeneratePaperPage.tsx             [REWRITTEN]
```

---

## Development Commands

```bash
# Install dependencies (one-time)
pnpm install

# Start all dev servers (Vite + Express)
pnpm dev

# Build for production
pnpm build

# Build past-papers only
pnpm build --filter past-papers

# Import CSV data
python3 database/import_questions.py

# Upload JPG files
node database/upload-questions.js

# Test API endpoint
curl -X POST http://localhost:3000/api/health
```

---

## Deployment (Vercel)

The current `vercel.json` configuration routes `/api/*` requests to serverless functions. For full production deployment:

1. Convert `server.js` to Vercel API routes (one-time setup)
2. Update environment variables in Vercel project settings
3. Deploy with `pnpm build && vercel deploy`

For now, the Express server works in development only.

---

## Performance Notes

- **PDF Composition:** 5 questions + mark schemes takes ~2-3 seconds
- **Large Papers:** 50+ questions may take 10-15 seconds
- **Storage Bandwidth:** Each JPG is ~80-120 KB; downloading 50 = ~5-6 MB data usage
- **Caching:** Supabase Storage has built-in CDN caching (3600s default)

---

## Future Enhancements

- [ ] Progress indicator during PDF generation (WebSocket streaming)
- [ ] Question preview thumbnails on hover
- [ ] Difficulty filter (if difficulty data is added to CSV)
- [ ] Time estimate based on marks
- [ ] Save/load custom paper templates
- [ ] Combine multiple papers into one document
- [ ] Export as ODT or Word instead of just PDF

---

## Troubleshooting

### Database errors:
- Check Supabase SQL logs for constraint violations
- Ensure table was created successfully: `SELECT COUNT(*) FROM questions_metadata;`

### Storage upload errors:
- Verify bucket is public
- Check file permissions in Supabase
- Ensure JPG files exist locally

### API errors (500):
- Check server logs: `pnpm dev:server` runs Express separately
- Verify Supabase credentials in `.env`
- Check network requests in browser DevTools

### Frontend issues:
- Clear browser cache and reload
- Check browser console for JavaScript errors
- Verify chapters exist: `SELECT DISTINCT chapter_num FROM questions_metadata;`

---

## Questions or Issues?

Refer to:
- `/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/CSV_AND_JPG_STRUCTURE.md` — Data structure reference
- `database/README.md` — Database setup guide
- `CLAUDE.md` — Project architecture overview
