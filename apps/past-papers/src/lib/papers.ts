import { supabase, PAPERS_BUCKET } from "@/integrations/supabase/client";

export type PaperType = "QP" | "MS";

export interface Question {
  id: string;
  paper: string;
  question_number: number;
  chapter_name: string;
  chapter_num: number;
  sub_topic: string;
  y_start: number;
  y_end: number;
  ms_y_start: number | null;
  ms_y_end: number | null;
}

export interface PaperFile {
  type: PaperType;
  url: string;
  fileName: string;
}

export interface ChapterEntry {
  number: number;
  name: string;
  questionPaper: PaperFile | null;
  markScheme: PaperFile | null;
}

interface ParsedFile {
  chapterNumber: number;
  chapterName: string;
  type: PaperType;
  fileName: string;
}

// Filename convention: {n}-{name}-{QP|MS}.pdf
// "name" may itself contain hyphens (e.g. "3-Number-and-Algebra-QP.pdf").
export function parseFileName(fileName: string): ParsedFile | null {
  if (!fileName.toLowerCase().endsWith(".pdf")) return null;
  const stem = fileName.slice(0, -4);

  const lastDash = stem.lastIndexOf("-");
  if (lastDash === -1) return null;
  const typeRaw = stem.slice(lastDash + 1).toUpperCase();
  if (typeRaw !== "QP" && typeRaw !== "MS") return null;

  const rest = stem.slice(0, lastDash);
  const firstDash = rest.indexOf("-");
  if (firstDash === -1) return null;

  const numberRaw = rest.slice(0, firstDash);
  const number = Number(numberRaw);
  if (!Number.isFinite(number)) return null;

  const rawName = rest.slice(firstDash + 1).trim();
  if (!rawName) return null;
  const chapterName = rawName.replace(/-+/g, " ").replace(/\s+/g, " ").trim();

  return { chapterNumber: number, chapterName, type: typeRaw, fileName };
}

async function listFolders(prefix: string): Promise<string[]> {
  const { data, error } = await supabase.storage.from(PAPERS_BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw error;
  // In Supabase Storage, folder entries have id === null.
  return (data ?? [])
    .filter((entry) => entry.id === null && entry.name && !entry.name.startsWith("."))
    .map((entry) => entry.name);
}

export async function listSubjects(): Promise<string[]> {
  return listFolders("");
}

export async function listComponents(subject: string): Promise<string[]> {
  return listFolders(subject);
}

export async function listChapters(subject: string, component: string): Promise<ChapterEntry[]> {
  const prefix = `${subject}/${component}`;
  const { data, error } = await supabase.storage.from(PAPERS_BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw error;

  const groups = new Map<number, ChapterEntry>();

  for (const entry of data ?? []) {
    if (entry.id === null) continue; // skip folders
    const parsed = parseFileName(entry.name);
    if (!parsed) continue;

    const { data: pub } = supabase.storage
      .from(PAPERS_BUCKET)
      .getPublicUrl(`${prefix}/${entry.name}`);

    const file: PaperFile = {
      type: parsed.type,
      url: pub.publicUrl,
      fileName: parsed.fileName,
    };

    const existing = groups.get(parsed.chapterNumber);
    if (existing) {
      if (parsed.type === "QP") existing.questionPaper = file;
      else existing.markScheme = file;
      // Prefer the QP-derived chapter name if both exist; otherwise take whatever came first.
      if (parsed.type === "QP") existing.name = parsed.chapterName;
    } else {
      groups.set(parsed.chapterNumber, {
        number: parsed.chapterNumber,
        name: parsed.chapterName,
        questionPaper: parsed.type === "QP" ? file : null,
        markScheme: parsed.type === "MS" ? file : null,
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) => a.number - b.number);
}

export async function getQuestionsByChapter(chapter: number): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions_metadata")
    .select("*")
    .eq("chapter_num", chapter)
    .order("id");

  if (error) throw error;
  return (data ?? []) as Question[];
}

export async function getChapterName(chapter: number): Promise<string | null> {
  const { data, error } = await supabase
    .from("questions_metadata")
    .select("chapter_name")
    .eq("chapter_num", chapter)
    .limit(1)
    .single();

  if (error) return null;
  return data?.chapter_name ?? null;
}

interface GeneratePaperOptions {
  includeMarkScheme?: boolean;
  randomize?: boolean;
}

export async function generatePaper(
  questionIds: string[],
  options: GeneratePaperOptions = {}
): Promise<Blob> {
  const response = await fetch("/api/compose-paper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      selections: Object.fromEntries(questionIds.map((id) => [id, true])),
      includeMarkScheme: options.includeMarkScheme ?? true,
      randomize: options.randomize ?? false,
    }),
  });

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      const text = await response.text().catch(() => "");
      if (text) errorMessage = text.slice(0, 200);
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text) throw new Error("Empty response from server");

  const { pdfBase64 } = JSON.parse(text);
  if (!pdfBase64) throw new Error("No PDF data in response");
  const binaryString = atob(pdfBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: "application/pdf" });
}
