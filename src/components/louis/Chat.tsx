import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUp, Feather, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PENDING_KEY } from "@/lib/louis/conversations";

export type Source = { n: number; title: string; url: string; authors?: string; year?: number; venue?: string; provider: string };
export type ChatMsg = { id: string; role: string; content: string; sources?: Source[] };

export function Composer({ onSend, busy, autoFocus = true, placeholder }: { onSend: (t: string) => void; busy: boolean; autoFocus?: boolean; placeholder?: string }) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (!busy && autoFocus) ref.current?.focus(); }, [busy, autoFocus]);
  const submit = () => {
    const t = text.trim();
    if (!t || busy) return;
    onSend(t);
    setText("");
  };
  return (
    <div className="rounded-xl border border-border bg-card p-2 page-shadow focus-within:border-primary/60">
      <Textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        placeholder={placeholder ?? "Tell Louis what you're working on… (Shift+Enter for a new line)"}
        className="manuscript max-h-80 min-h-[3.5rem] resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
        aria-label="Message Louis"
      />
      <div className="flex items-center justify-between px-2 pb-1">
        <span className="text-xs text-muted-foreground">Louis remembers, researches and edits as you talk.</span>
        <Button size="icon" className="h-9 w-9 rounded-full" onClick={submit} disabled={busy || !text.trim()} aria-label="Send">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

function Bubble({ m }: { m: ChatMsg }) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="manuscript max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-secondary px-4 py-3 text-secondary-foreground">{m.content}</div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-card"><Feather className="h-4 w-4 text-gold" /></div>
      <div className="min-w-0 flex-1">
        <div className="louis-prose manuscript">
          <ReactMarkdown components={{ a: (p) => <a {...p} target="_blank" rel="noreferrer" /> }}>{m.content || "…"}</ReactMarkdown>
        </div>
        {!!m.sources?.length && (
          <div className="mt-4 rounded-lg border border-border bg-card/60 p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Sources</p>
            <ol className="space-y-1 text-sm">
              {m.sources.map((s) => (
                <li key={s.n} className="text-muted-foreground">
                  <span className="text-gold">[{s.n}]</span>{" "}
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-foreground underline-offset-4 hover:underline">{s.title}</a>
                  {s.authors ? ` — ${s.authors}` : ""}{s.year ? ` (${s.year})` : ""} · {s.provider}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatThread({ conversationId, initial }: { conversationId: string; initial: ChatMsg[] }) {
  const qc = useQueryClient();
  const [msgs, setMsgs] = useState<ChatMsg[]>(initial);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, status]);

  const send = async (content: string) => {
    setBusy(true);
    setStatus("Thinking…");
    const tmp = `a-${Date.now()}`;
    setMsgs((p) => [...p, { id: `u-${Date.now()}`, role: "user", content }, { id: tmp, role: "assistant", content: "" }]);
    const patch = (f: (m: ChatMsg) => ChatMsg) => setMsgs((p) => p.map((m) => (m.id === tmp ? f(m) : m)));
    try {
      const { data } = await supabase.auth.getSession();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${data.session?.access_token ?? ""}` },
        body: JSON.stringify({ conversationId, content }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.t === "delta") { setStatus(""); patch((m) => ({ ...m, content: m.content + ev.v })); }
          else if (ev.t === "status") setStatus(ev.v);
          else if (ev.t === "sources") patch((m) => ({ ...m, sources: ev.v }));
          else if (ev.t === "done") { patch((m) => ({ ...m, id: ev.id })); setBusy(false); setStatus("Louis is noting what matters…"); qc.invalidateQueries({ queryKey: ["conversations"] }); }
          else if (ev.t === "learned") { setStatus(""); qc.invalidateQueries({ queryKey: ["memories"] }); }
          else if (ev.t === "error") { toast.error(ev.v); setMsgs((p) => p.filter((m) => m.id !== tmp || m.content)); }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Louis couldn't be reached. Please try again.");
      setMsgs((p) => p.filter((m) => m.id !== tmp || m.content));
    } finally {
      setBusy(false);
      setStatus("");
      qc.invalidateQueries({ queryKey: ["conversation", conversationId] });
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const pending = sessionStorage.getItem(PENDING_KEY(conversationId));
    if (pending) {
      sessionStorage.removeItem(PENDING_KEY(conversationId));
      void send(pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col">
      <div className="flex-1 space-y-8 pb-6">
        {msgs.map((m) => <Bubble key={m.id} m={m} />)}
        {status && (
          <p className="flex items-center gap-2 pl-11 text-sm italic text-muted-foreground">
            {status.startsWith("Researching") ? <Search className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />} {status}
          </p>
        )}
        <div ref={endRef} />
      </div>
      <div className="sticky bottom-0 bg-background/95 pb-4 pt-2 backdrop-blur">
        <Composer onSend={send} busy={busy} placeholder="Reply to Louis…" />
      </div>
    </div>
  );
}
