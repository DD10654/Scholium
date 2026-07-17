export const normalizeAnswer = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, " ");
