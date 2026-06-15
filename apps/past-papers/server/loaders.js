// Source loaders for the PDF composer. A loader fetches the per-exam source PDFs
// and their `_questions.json` / `_mark_schemes.json` indexes for one subject.
//
//   loadIndex(paperNum, kind)          -> parsed JSON object
//   loadPdfBytes(paperNum, kind, stem) -> Uint8Array | Buffer
//
// `kind` is "questions" or "mark_schemes".
//
//  - createLocalLoader: reads from the local PastPapers folders (dev / Express).
//  - createR2Loader:    fetches from R2 over HTTP under the `_source/` prefix
//                       (prod / Vercel serverless), since functions have no disk.

import fs from 'fs/promises';
import path from 'path';

const indexFileName = (kind) =>
  kind === 'questions' ? '_questions.json' : '_mark_schemes.json';

// ---- Local disk (dev) -------------------------------------------------------

const PAST_PAPERS_BASE =
  process.env.PAST_PAPERS_BASE ||
  (process.env.PAST_PAPERS_DIR
    ? path.dirname(process.env.PAST_PAPERS_DIR)
    : '/Users/aarav/Desktop/Coding/Scholium/PastPapers');

// Resolve a subject's source folder by its leading code,
// e.g. "0606" -> "0606 (Additional Mathematics)".
async function localSubjectDir(subject) {
  const entries = await fs.readdir(PAST_PAPERS_BASE, { withFileTypes: true });
  const match = entries.find((e) => e.isDirectory() && e.name.startsWith(subject));
  if (!match) {
    throw new Error(`No source folder for subject "${subject}" under ${PAST_PAPERS_BASE}`);
  }
  return path.join(PAST_PAPERS_BASE, match.name);
}

export function createLocalLoader(subject) {
  let dirPromise;
  const dir = () => (dirPromise ??= localSubjectDir(subject));
  return {
    async loadIndex(paperNum, kind) {
      const fp = path.join(await dir(), `Paper ${paperNum}`, indexFileName(kind));
      return JSON.parse(await fs.readFile(fp, 'utf-8'));
    },
    async loadPdfBytes(paperNum, kind, stem) {
      const fp = path.join(await dir(), `Paper ${paperNum}`, kind, `${stem}.pdf`);
      return fs.readFile(fp);
    },
  };
}

// ---- R2 over HTTP (prod) ----------------------------------------------------

const R2_PUBLIC_URL = (
  process.env.VITE_R2_PUBLIC_URL ||
  process.env.R2_PUBLIC_URL ||
  ''
).replace(/\/+$/, '');

const enc = encodeURIComponent;

export function createR2Loader(subject) {
  if (!R2_PUBLIC_URL) {
    throw new Error('Missing VITE_R2_PUBLIC_URL (R2 public URL) for the source loader');
  }
  // Source files live under `_source/<subject>/Paper N/...` in the public bucket.
  const base = (paperNum) =>
    `${R2_PUBLIC_URL}/_source/${enc(subject)}/${enc(`Paper ${paperNum}`)}`;
  return {
    async loadIndex(paperNum, kind) {
      const url = `${base(paperNum)}/${enc(indexFileName(kind))}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`R2 index fetch ${res.status} for ${url}`);
      return res.json();
    },
    async loadPdfBytes(paperNum, kind, stem) {
      const url = `${base(paperNum)}/${enc(kind)}/${enc(`${stem}.pdf`)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`R2 pdf fetch ${res.status} for ${url}`);
      return new Uint8Array(await res.arrayBuffer());
    },
  };
}
