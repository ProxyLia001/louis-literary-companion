import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { chapterQuery, countWords } from "@/lib/projects";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/library/$projectId/$chapterId")({
  head: () => ({ meta: [
    { title: "Chapter — Louis" }, { name: "description", content: "Write your chapter." },
    { property: "og:title", content: "Chapter — Louis" }, { property: "og:description", content: "Write your chapter." },
  ] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(chapterQuery(params.chapterId)),
  component: ChapterPage,
});

function ChapterPage() {
  const { projectId, chapterId } = Route.useParams();
  const { data: c } = useSuspenseQuery(chapterQuery(chapterId));
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [title, setTitle] = useState(c.title);
  const [content, setContent] = useState(c.content);
  const [status, setStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setStatus("unsaved");
    const t = setTimeout(async () => {
      setStatus("saving");
      const { error } = await supabase.from("chapters").update({ title, content, word_count: countWords(content) }).eq("id", chapterId);
      if (error) { toast.error(`Not saved: ${error.message}`); setStatus("unsaved"); return; }
      setStatus("saved");
      qc.invalidateQueries({ queryKey: ["project", projectId] }); qc.invalidateQueries({ queryKey: ["projects"] });
    }, 900);
    return () => clearTimeout(t);
  }, [title, content, chapterId, projectId, qc]);

  const remove = async () => {
    if (!confirm("Delete this chapter permanently?")) return;
    const { error } = await supabase.from("chapters").delete().eq("id", chapterId);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["project", projectId] });
    navigate({ to: "/library/$projectId", params: { projectId } });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
        <Link to="/library/$projectId" params={{ projectId }} className="hover:text-foreground">← Project</Link>
        <span>{countWords(content).toLocaleString()} words · {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Unsaved"}</span>
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Chapter title"
        className="w-full bg-transparent font-display text-4xl outline-none" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} aria-label="Chapter text"
        placeholder="Begin…"
        className="manuscript mt-6 min-h-[70vh] w-full resize-none rounded-lg border border-border bg-card p-6 page-shadow outline-none focus:border-primary/50 md:p-10" />
      <Button variant="ghost" className="mt-4 text-destructive" onClick={remove}>Delete chapter</Button>
    </div>
  );
}
