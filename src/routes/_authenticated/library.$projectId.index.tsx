import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/louis/AppShell";
import { projectQuery } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/library/$projectId/")({
  head: () => ({ meta: [
    { title: "Project — Louis" }, { name: "description", content: "Chapters and details of your project." },
    { property: "og:title", content: "Project — Louis" }, { property: "og:description", content: "Chapters and details of your project." },
  ] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(projectQuery(params.projectId)),
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId } = Route.useParams();
  const { data: p } = useSuspenseQuery(projectQuery(projectId));
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: p.title, genre: p.genre ?? "", synopsis: p.synopsis ?? "", narrative_perspective: p.narrative_perspective ?? "", themes: p.themes.join(", ") });

  const save = async () => {
    const { error } = await supabase.from("projects").update({
      title: form.title.trim() || p.title, genre: form.genre || null, synopsis: form.synopsis || null,
      narrative_perspective: form.narrative_perspective || null,
      themes: form.themes.split(",").map((t) => t.trim()).filter(Boolean),
    }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Project saved");
    qc.invalidateQueries({ queryKey: ["project", p.id] }); qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const addChapter = async () => {
    const { data, error } = await supabase.from("chapters")
      .insert({ project_id: p.id, title: `Chapter ${p.chapters.length + 1}`, position: p.chapters.length }).select("id").single();
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["project", p.id] }); qc.invalidateQueries({ queryKey: ["projects"] });
    navigate({ to: "/library/$projectId/$chapterId", params: { projectId: p.id, chapterId: data.id } });
  };

  const remove = async () => {
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["projects"] });
    navigate({ to: "/library" });
  };

  return (
    <>
      <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground">← Library</Link>
      <PageHeader eyebrow={p.genre || "Project"} title={p.title} />
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl">Chapters</h2>
            <Button size="sm" onClick={addChapter}><Plus className="h-4 w-4" /> New chapter</Button>
          </div>
          {p.chapters.length === 0 ? (
            <p className="manuscript text-muted-foreground">No chapters yet.</p>
          ) : (
            <ol className="divide-y divide-border rounded-lg border border-border bg-card">
              {p.chapters.map((c, i) => (
                <li key={c.id}>
                  <Link to="/library/$projectId/$chapterId" params={{ projectId: p.id, chapterId: c.id }}
                    className="flex items-baseline justify-between gap-4 px-5 py-4 hover:bg-accent/40">
                    <span><span className="mr-3 text-muted-foreground">{i + 1}.</span><span className="font-display text-lg">{c.title}</span></span>
                    <span className="text-xs text-muted-foreground">{c.word_count.toLocaleString()} words</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>
        <aside className="grid content-start gap-4 rounded-lg border border-border bg-card p-5">
          <h2 className="text-xl">Details</h2>
          <div className="grid gap-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label>Genre</Label><Input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label>Themes (comma-separated)</Label><Input value={form.themes} onChange={(e) => setForm({ ...form, themes: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label>Narrative perspective</Label><Input placeholder="e.g. close third, past tense" value={form.narrative_perspective} onChange={(e) => setForm({ ...form, narrative_perspective: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label>Synopsis</Label><Textarea rows={6} value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} /></div>
          <Button onClick={save}>Save details</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /> Delete project</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Delete “{p.title}”?</AlertDialogTitle>
                <AlertDialogDescription>All chapters and story information for this project will be permanently removed.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Keep it</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </aside>
      </div>
    </>
  );
}
