import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, Dumbbell, FolderOpen, FolderPlus, Plus } from "lucide-react";

const FOLDERS = [
  { id: "f-1", name: "Travel", description: "Phrases for the road, the platform, the table." },
  { id: "f-2", name: "Cooking", description: "Kitchen, market, and recipe vocabulary." },
  { id: "f-3", name: "Business", description: "Meetings, email, and finance terms." },
];

interface DemoSet {
  id: string;
  name: string;
  description: string;
  language: "french" | "spanish";
  item_count: number;
  progress: number;
}

const SETS: DemoSet[] = [
  {
    id: "s-1",
    name: "Le marché",
    description: "Fruits, vegetables, weights, and prices.",
    language: "french",
    item_count: 42,
    progress: 68,
  },
  {
    id: "s-2",
    name: "Verbos irregulares",
    description: "Common irregular verbs in present and past.",
    language: "spanish",
    item_count: 56,
    progress: 41,
  },
  {
    id: "s-3",
    name: "À la gare",
    description: "Train station, schedules, and tickets.",
    language: "french",
    item_count: 28,
    progress: 82,
  },
  {
    id: "s-4",
    name: "El restaurante",
    description: "Ordering food, drinks, and the bill.",
    language: "spanish",
    item_count: 34,
    progress: 23,
  },
];

export default function Demo() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto max-w-4xl px-6 pt-10 pb-2">
        <h1 className="text-foreground text-3xl sm:text-4xl font-bold tracking-tight">
          Language Hub.
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
          A field-notebook for vocabulary in French 🇫🇷 and Spanish 🇪🇸, flashcards, drills, dictation, until the words become yours.
        </p>
      </header>

      <div className="container mx-auto max-w-4xl px-6 pt-8 pb-0 flex gap-3 flex-wrap">
        <Button variant="default" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create New Set
        </Button>
        <Button variant="default" size="lg">
          <Dumbbell className="mr-2 h-5 w-5" />
          Practice
        </Button>
      </div>

      <main className="container mx-auto max-w-4xl px-6 py-12 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground font-display">Folders</h2>
            <Button variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {FOLDERS.map((folder) => (
              <Card key={folder.id} className="shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-2">
                    <FolderOpen className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <CardTitle className="text-lg font-display">{folder.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-1">
                        {folder.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {folder.id === "f-1" ? "4 sets" : folder.id === "f-2" ? "3 sets" : "2 sets"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground font-display">Your Vocabulary Sets</h2>
            <span className="text-muted-foreground text-sm">{SETS.length} sets</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {SETS.map((set) => (
              <Card key={set.id} className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-display">{set.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {set.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {set.item_count} terms
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {set.progress}% mastered
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {set.language === "spanish" ? "🇪🇸 Spanish" : "🇫🇷 French"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full gradient-success transition-all duration-500"
                      style={{ width: `${set.progress}%` }}
                    />
                  </div>
                  <Button variant="default" className="w-full">
                    Study Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
