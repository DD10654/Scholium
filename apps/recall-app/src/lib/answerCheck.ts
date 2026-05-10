const ARTICLES = /^(the|a|an)\s+/i;
const PUNCT = /[.,/#!$%^&*;:{}=\-_`~()?'"]/g;
const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "is","are","was","were","be","been","being","it","its","that","this","which","from","as","into",
]);

function normalizeText(text: string): string {
  return text.toLowerCase().replace(PUNCT, "").replace(ARTICLES, "").replace(/\s+/g, " ").trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array(n + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function tolerance(s: string): number {
  const len = s.length;
  if (len <= 4) return 0;
  if (len <= 8) return 1;
  return 2;
}

export function checkPass3Answer(userInput: string, correctAnswer: string): boolean {
  const user = normalizeText(userInput);
  const correct = normalizeText(correctAnswer);
  if (user === correct) return true;
  return levenshtein(user, correct) <= tolerance(correct);
}

export interface Pass4Result {
  correct: boolean;
  matched: number;
  total: number;
}

export function checkPass4Answer(userInput: string, correctAnswer: string): Pass4Result {
  const keyWords = correctAnswer
    .toLowerCase()
    .replace(PUNCT, "")
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));

  if (keyWords.length === 0) return { correct: true, matched: 0, total: 0 };

  const userWords = userInput.toLowerCase().replace(PUNCT, "").split(/\s+/);

  const matched = keyWords.filter(kw =>
    userWords.some(uw => uw === kw || (kw.length >= 5 && levenshtein(uw, kw) <= 1))
  ).length;

  return { correct: matched / keyWords.length >= 0.7, matched, total: keyWords.length };
}
