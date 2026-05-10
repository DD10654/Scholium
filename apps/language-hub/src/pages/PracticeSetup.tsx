import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { QuestionType } from "@/components/QuizSession";

const TYPE_OPTIONS: { type: QuestionType; label: string; description: string }[] = [
  {
    type: "fr-to-en",
    label: "🌍 → 🇬🇧 Translate to English",
    description: "See the foreign word, type the English meaning",
  },
  {
    type: "en-to-fr",
    label: "🇬🇧 → 🌍 Translate from English",
    description: "See the English meaning, type the foreign word",
  },
  {
    type: "dictation",
    label: "🎧 Dictation",
    description: "Hear the foreign word, type what you hear",
  },
];

const PracticeSetup = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(20);
  const [countInput, setCountInput] = useState("20");
  const [selectedTypes, setSelectedTypes] = useState<Set<QuestionType>>(
    new Set(["fr-to-en", "en-to-fr", "dictation"]),
  );

  const toggleType = (type: QuestionType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size === 1) return prev; // must keep at least one
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleCountInput = (value: string) => {
    setCountInput(value);
    const n = parseInt(value, 10);
    if (!isNaN(n)) setCount(Math.min(100, Math.max(20, n)));
  };

  const handleCountBlur = () => {
    const clamped = Math.min(100, Math.max(20, count));
    setCount(clamped);
    setCountInput(String(clamped));
  };

  const startPractice = () => {
    const types = Array.from(selectedTypes).join(",");
    navigate(`/practice?count=${count}&types=${types}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-2xl px-6 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-display">Practice Setup</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-6 py-10 space-y-6">
        {/* Count */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Number of Flashcards</CardTitle>
            <CardDescription>Choose between 20 and 100 questions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              min={20}
              max={100}
              step={1}
              value={[count]}
              onValueChange={([v]) => { setCount(v); setCountInput(String(v)); }}
            />
            <div className="flex items-center gap-3">
              <Label htmlFor="count-input" className="text-muted-foreground text-sm shrink-0">
                Exact count:
              </Label>
              <Input
                id="count-input"
                type="number"
                min={20}
                max={100}
                value={countInput}
                onChange={(e) => handleCountInput(e.target.value)}
                onBlur={handleCountBlur}
                className="w-24 text-center"
              />
            </div>
          </CardContent>
        </Card>

        {/* Question types */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Question Types</CardTitle>
            <CardDescription>Select at least one type to practice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {TYPE_OPTIONS.map(({ type, label, description }) => (
              <label
                key={type}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedTypes.has(type)}
                  onCheckedChange={() => toggleType(type)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        <Button variant="hero" className="w-full" size="lg" onClick={startPractice}>
          <Dumbbell className="mr-2 h-5 w-5" />
          Start Practice ({count} cards)
        </Button>
      </main>
    </div>
  );
};

export default PracticeSetup;
