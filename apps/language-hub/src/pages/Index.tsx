import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Plus, BookOpen, Trash2, BarChart3, Dumbbell, Pencil, FolderOpen, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface VocabularySet {
  id: string;
  name: string;
  description: string | null;
  language: string;
  folder_id: string | null;
  created_at: string;
  item_count?: number;
  progress?: number;
}

interface Folder {
  id: string;
  name: string;
  description: string | null;
  set_count: number;
}

const Index = ({ description }: { description?: string | null } = {}) => {
  const [sets, setSets] = useState<VocabularySet[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const { data: setsData, error: setsError } = await supabase
        .from("vocabulary_sets")
        .select("*")
        .order("created_at", { ascending: false });

      if (setsError) throw setsError;

      // Folders table may not exist yet (pre-migration). Treat as no folders in that case.
      const { data: foldersData } = await supabase
        .from("folders")
        .select("*")
        .order("created_at", { ascending: false });

      const setsWithStats = await Promise.all(
        (setsData || []).map(async (set) => {
          const { count: itemCount } = await supabase
            .from("vocabulary_items")
            .select("*", { count: "exact", head: true })
            .eq("set_id", set.id);

          const { count: masteredCount } = await supabase
            .from("set_progress")
            .select("*", { count: "exact", head: true })
            .eq("set_id", set.id)
            .eq("mastered", true);

          return {
            ...set,
            item_count: itemCount || 0,
            progress: itemCount ? Math.round(((masteredCount || 0) / itemCount) * 100) : 0,
          };
        }),
      );

      setSets(setsWithStats);

      const foldersWithCounts: Folder[] = (foldersData || []).map((folder) => ({
        id: folder.id,
        name: folder.name,
        description: folder.description,
        set_count: setsWithStats.filter((s) => s.folder_id === folder.id).length,
      }));
      setFolders(foldersWithCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load vocabulary sets");
    } finally {
      setLoading(false);
    }
  };

  const deleteSet = async (id: string) => {
    try {
      const { error } = await supabase.from("vocabulary_sets").delete().eq("id", id);
      if (error) throw error;
      setSets(sets.filter((s) => s.id !== id));
      toast.success("Set deleted successfully");
    } catch (error) {
      console.error("Error deleting set:", error);
      toast.error("Failed to delete set");
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      const { error } = await supabase.from("folders").delete().eq("id", folderId);
      if (error) throw error;
      toast.success("Folder deleted, sets preserved");
      fetchAll();
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder");
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name is required");
      return;
    }
    try {
      const { error } = await supabase.from("folders").insert({
        name: newFolderName.trim(),
        description: newFolderDescription.trim() || null,
      });
      if (error) throw error;
      toast.success("Folder created");
      setNewFolderOpen(false);
      setNewFolderName("");
      setNewFolderDescription("");
      fetchAll();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const uncategorizedSets = sets.filter((s) => !s.folder_id);

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto max-w-4xl px-6 pt-10 pb-2">
        <h1 className="text-foreground text-3xl sm:text-4xl font-bold tracking-tight">
          Language Hub.
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
          {description ?? "A field-notebook for vocabulary in French 🇫🇷 and Spanish 🇪🇸, flashcards, drills, dictation, until the words become yours."}
        </p>
      </header>

      <div className="container mx-auto max-w-4xl px-6 pt-8 pb-0 flex gap-3 flex-wrap">
        <Link to="/create">
          <Button variant="default" size="lg" className="animate-bounce-soft">
            <Plus className="mr-2 h-5 w-5" />
            Create New Set
          </Button>
        </Link>
        <Link to="/practice-setup">
          <Button variant="default" size="lg">
            <Dumbbell className="mr-2 h-5 w-5" />
            Practice
          </Button>
        </Link>
      </div>

      <main className="container mx-auto max-w-4xl px-6 py-12 space-y-12">
        {/* Folders section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground font-display">Folders</h2>
            <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Folder</DialogTitle>
                  <DialogDescription>
                    Group related vocabulary sets together.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-folder-name">Name *</Label>
                    <Input
                      id="new-folder-name"
                      placeholder="e.g., Travel Vocabulary"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-folder-description">Description (optional)</Label>
                    <Input
                      id="new-folder-description"
                      placeholder="e.g., Phrases and words for traveling"
                      value={newFolderDescription}
                      onChange={(e) => setNewFolderDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewFolderOpen(false)}>Cancel</Button>
                  <Button onClick={createFolder}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse h-24" />
              ))}
            </div>
          ) : folders.length === 0 ? (
            <Card className="text-center py-8 shadow-card">
              <CardContent>
                <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No folders yet. Create one to organize your sets.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {folders.map((folder) => (
                <Card
                  key={folder.id}
                  className="group shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Link to={`/folder/${folder.id}`} className="flex-1 flex items-start gap-2">
                        <FolderOpen className="h-5 w-5 text-accent mt-1" />
                        <div>
                          <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">
                            {folder.name}
                          </CardTitle>
                          {folder.description && (
                            <CardDescription className="mt-1 line-clamp-1">
                              {folder.description}
                            </CardDescription>
                          )}
                        </div>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this folder?</AlertDialogTitle>
                            <AlertDialogDescription>
                              The folder "{folder.name}" will be deleted. The sets inside it will not be deleted, they will become uncategorized.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteFolder(folder.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/folder/${folder.id}`}>
                      <p className="text-sm text-muted-foreground">
                        {folder.set_count} {folder.set_count === 1 ? "set" : "sets"}
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Sets section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground font-display">Your Vocabulary Sets</h2>
            <span className="text-muted-foreground text-sm">
              {uncategorizedSets.length} {uncategorizedSets.length === 1 ? "set" : "sets"}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : uncategorizedSets.length === 0 ? (
            <Card className="text-center py-16 shadow-card">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {sets.length === 0 ? "No vocabulary sets yet" : "All sets are in folders"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {sets.length === 0
                    ? "Create your first set to start learning!"
                    : "Open a folder above to see your sets."}
                </p>
                <Link to="/create">
                  <Button variant="hero" size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Create {sets.length === 0 ? "Your First Set" : "New Set"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {uncategorizedSets.map((set, index) => (
                <Card
                  key={set.id}
                  className="group shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">
                          {set.name}
                        </CardTitle>
                        {set.description && (
                          <CardDescription className="mt-1 line-clamp-2">
                            {set.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Link to={`/edit/${set.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="animate-scale-in">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this set?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the vocabulary set "{set.name}" and all its contents.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSet(set.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {set.item_count} {set.item_count === 1 ? "term" : "terms"}
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

                    <Link to={`/study/${set.id}`}>
                      <Button variant="default" className="w-full">
                        Study Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
