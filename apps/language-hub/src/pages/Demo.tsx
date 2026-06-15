import { Button } from "@/components/ui/button";
import { QuizSession, type QuizQuestion } from "@/components/QuizSession";

// The trial uses the real practice UI (QuizSession) so it looks and behaves
// exactly like the app — just three hardcoded French words and no Supabase,
// so anyone can try it without an account. Dictation is omitted so no audio
// API is needed.
const QUESTIONS: QuizQuestion[] = [
  {
    item: { id: "d1", term: "la maison", definition: "house" },
    type: "fr-to-en",
    prompt: 'Translate to English: "la maison"',
    answer: "house",
    language: "french",
  },
  {
    item: { id: "d2", term: "le livre", definition: "book" },
    type: "en-to-fr",
    prompt: 'Translate to French: "book"',
    answer: "le livre",
    language: "french",
  },
  {
    item: { id: "d3", term: "la pomme", definition: "apple" },
    type: "fr-to-en",
    prompt: 'Translate to English: "la pomme"',
    answer: "apple",
    language: "french",
  },
];

export default function Demo() {
  return (
    <QuizSession
      questions={QUESTIONS}
      title="French Practice"
      headerActions={
        <a
          href="/auth"
          className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
        >
          Sign up to save →
        </a>
      }
      completionTitle="Nice work!"
      completionSubtitle="That's a taste of Language Hub"
      completionActions={
        <>
          <a href="/auth">
            <Button variant="hero">Create free account</Button>
          </a>
          <a href="/demo">
            <Button variant="outline">Practise again</Button>
          </a>
        </>
      }
    />
  );
}
