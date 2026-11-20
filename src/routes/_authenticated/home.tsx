import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { projectsQuery } from "@/lib/projects";
import { PENDING_KEY } from "@/lib/louis/conversations";
import { Composer } from "@/components/louis/Chat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [
    { title: "Talk to Louis" }, { name: "description", content: "Start a conversation with Louis, your AI literary partner." },
    { property: "og:title", content: "Talk to Louis" }, { property: "og:description", content: "Start a conversation with Louis." },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  component: NewChat,
});

const STARTERS = [
  "I have a half-formed idea for a psychological thriller. Let me explain it and tell me honestly where it's weak.",
  "Here's a scene I wrote. Give it a literary edit, but keep my voice.",
  "What did Victorian asylums actually look like? I need it accurate, with sources.",
  "Brainstorm three genuinely different twists for my mystery — no recycled ones.",
];

function NewChat() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const [projectId, setProjectId] = useState<string>("none");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const start = async (content: string) => {
    setBusy(true);
    const { data, error } = await supabase
      .from("conversations")
      .insert({ title: content.replace(/\s+/g, " ").slice(0, 70), project_id: projectId === "none" ? null : projectId })
      .select("id")
      .single();
    if (error || !data) { setBusy(false); toast.error("Couldn't start the conversation."); return; }
    sessionStorage.setItem(PENDING_KEY(data.id), content);
    qc.invalidateQueries({ queryKey: ["conversations"] });
    navigate({ to: "/chat/$conversationId", params: { conversationId: data.id } });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Louis · literary partner</p>
      <h1 className="mt-3 text-4xl md:text-6xl">What are we writing today?</h1>
      <p className="manuscript mt-4 text-lg text-muted-foreground">
        Explain an idea at whatever length it needs. I'll ask what I need to know, push back where it's weak, research what must be true, and remember it next time.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">About</span>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-64" aria-label="Which novel"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No specific novel</SelectItem>
            {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4"><Composer onSend={start} busy={busy} /></div>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {STARTERS.map((s) => (
          <button key={s} disabled={busy} onClick={() => start(s)} className="manuscript rounded-lg border border-border bg-card/50 p-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
