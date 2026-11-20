import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { generateChatCompletion, streamChatCompletion, GatewayError } from "@lovable.dev/ai-gateway";
import type { Database } from "@/integrations/supabase/types";
import { LOUIS_PERSONA } from "./persona";
import { research, type Source } from "./research.server";

const MODEL = "openai/gpt-6-astra" as const;
type DB = SupabaseClient<Database>;
type Msg = { role: "system" | "user" | "assistant"; content: string };

export function userClient(token: string): DB {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function json<T>(system: string, user: string): Promise<T | null> {
  try {
    const r = await generateChatCompletion({
      model: MODEL,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    });
    const text = (r as any).choices?.[0]?.message?.content ?? "";
    return JSON.parse(text) as T;
  } catch (e) {
    console.error("louis json step failed", e);
    return null;
  }
}

async function loadContext(db: DB, conversationId: string) {
  const { data: convo, error } = await db.from("conversations").select("*").eq("id", conversationId).single();
  if (error || !convo) throw new Error("Conversation not found");
  const pid = convo.project_id;
  const [history, writerMem, projectMem, profile, project, bible, chapters] = await Promise.all([
    db.from("messages").select("role, content").eq("conversation_id", conversationId).order("created_at", { ascending: false }).limit(40),
    db.from("memories").select("content, category").eq("layer", "writer").eq("is_active", true).order("updated_at", { ascending: false }).limit(60),
    pid ? db.from("memories").select("content, category").eq("layer", "project").eq("project_id", pid).eq("is_active", true).order("updated_at", { ascending: false }).limit(80) : Promise.resolve({ data: [] as any[] }),
    db.from("writer_profile_versions").select("profile, version").order("version", { ascending: false }).limit(1).maybeSingle(),
    pid ? db.from("projects").select("title, genre, synopsis, themes, narrative_perspective").eq("id", pid).single() : Promise.resolve({ data: null }),
    pid ? db.from("bible_entries").select("kind, name, notes").eq("project_id", pid).limit(100) : Promise.resolve({ data: [] as any[] }),
    pid ? db.from("chapters").select("title, content, position").eq("project_id", pid).order("position") : Promise.resolve({ data: [] as any[] }),
  ]);
  return {
    convo,
    history: (history.data ?? []).reverse() as Msg[],
    writerMem: writerMem.data ?? [],
    projectMem: (projectMem as any).data ?? [],
    profile: profile.data,
    project: (project as any).data,
    bible: (bible as any).data ?? [],
    chapters: ((chapters as any).data ?? []) as { title: string; content: string }[],
  };
}

function contextBlock(c: Awaited<ReturnType<typeof loadContext>>, sources: Source[]) {
  const parts: string[] = [];
  const obs = (c.profile?.profile as any)?.observations as string[] | undefined;
  if (obs?.length) parts.push(`WRITER PROFILE (v${c.profile!.version}):\n- ${obs.join("\n- ")}`);
  if (c.writerMem.length) parts.push(`WHAT YOU REMEMBER ABOUT THIS WRITER:\n- ${c.writerMem.map((m: any) => m.content).join("\n- ")}`);
  if (c.project) {
    const p = c.project;
    parts.push(`CURRENT NOVEL: "${p.title}"${p.genre ? ` — ${p.genre}` : ""}${p.narrative_perspective ? `, ${p.narrative_perspective}` : ""}\n${p.synopsis ?? ""}${p.themes?.length ? `\nThemes: ${p.themes.join(", ")}` : ""}`);
    if (c.bible.length) parts.push(`STORY BIBLE:\n${c.bible.map((b: any) => `- [${b.kind}] ${b.name}: ${b.notes ?? ""}`).join("\n")}`);
    if (c.projectMem.length) parts.push(`WHAT YOU REMEMBER ABOUT THIS NOVEL:\n- ${c.projectMem.map((m: any) => m.content).join("\n- ")}`);
    let budget = 40000;
    const ex = c.chapters.map((ch) => {
      const t = (ch.content ?? "").slice(0, Math.max(0, Math.min(budget, 12000)));
      budget -= t.length;
      return t ? `### ${ch.title}\n${t}` : `### ${ch.title} (empty)`;
    });
    if (ex.length) parts.push(`MANUSCRIPT (chapter excerpts, for continuity checks):\n${ex.join("\n\n")}`);
  } else {
    parts.push("No novel is attached to this conversation. Talk freely; if the writer starts discussing a specific novel, you may suggest attaching it from the novel selector so you can remember its details separately.");
  }
  if (sources.length) {
    parts.push(`SOURCES retrieved live this turn (cite as [n]; only what they support):\n${sources.map((s) => `[${s.n}] ${s.title}${s.authors ? ` — ${s.authors}` : ""}${s.year ? ` (${s.year})` : ""}${s.venue ? `, ${s.venue}` : ""} · ${s.provider} · ${s.url}\n${s.snippet ?? ""}`).join("\n\n")}`);
  }
  return parts.join("\n\n");
}

export async function handleChat(db: DB, userId: string, conversationId: string, content: string): Promise<Response> {
  const c = await loadContext(db, conversationId);
  const { error: insErr } = await db.from("messages").insert({ conversation_id: conversationId, role: "user", content });
  if (insErr) throw insErr;
  const recent = c.history.slice(-6).map((m) => `${m.role}: ${m.content.slice(0, 600)}`).join("\n");

  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(ctrl) {
      const send = (o: unknown) => ctrl.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      try {
        // 1. Decide whether this turn needs live research.
        const plan = await json<{ research: boolean; academic: boolean; queries: string[] }>(
          'Decide if answering the latest user message needs factual lookup (history, science, medicine, psychology, law, places, real events, techniques). Reply JSON {"research":bool,"academic":bool,"queries":[up to 3 short English search queries]}. Pure craft/brainstorming/editing → research:false.',
          `Recent:\n${recent}\n\nLatest user message:\n${content}`,
        );
        let sources: Source[] = [];
        if (plan?.research && plan.queries?.length) {
          send({ t: "status", v: `Researching: ${plan.queries.join(" · ")}` });
          sources = await research(plan.queries, !!plan.academic);
          send({ t: "sources", v: sources });
        }
        send({ t: "status", v: "" });

        // 2. Stream Louis's answer.
        const messages: Msg[] = [
          { role: "system", content: LOUIS_PERSONA },
          { role: "system", content: contextBlock(c, sources) },
          ...c.history,
          { role: "user", content },
        ];
        const s = await streamChatCompletion({ model: MODEL, reasoning_effort: "medium", messages });
        let answer = "";
        for await (const ev of s as AsyncIterable<any>) {
          const d = ev?.choices?.[0]?.delta?.content;
          if (d) {
            answer += d;
            send({ t: "delta", v: d });
          }
        }
        const { data: saved, error } = await db
          .from("messages")
          .insert({ conversation_id: conversationId, role: "assistant", content: answer, parts: { sources } as any })
          .select("id")
          .single();
        if (error) throw error;
        const title = c.history.length === 0 ? content.replace(/\s+/g, " ").slice(0, 70) : undefined;
        await db.from("conversations").update({ updated_at: new Date().toISOString(), ...(title ? { title } : {}) }).eq("id", conversationId);
        send({ t: "done", id: saved.id });

        // 3. Learn: extract lasting memories, story-bible facts and style observations.
        await learn(db, userId, c, content, answer, conversationId);
        send({ t: "learned" });
      } catch (e) {
        console.error("louis chat failed", e);
        const msg = e instanceof GatewayError && e.code === "payment_required" ? "AI credits are exhausted — top up in Settings to keep talking with Louis." : "Louis couldn't answer just now. Please try again.";
        send({ t: "error", v: msg });
      } finally {
        ctrl.close();
      }
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
}

async function learn(db: DB, userId: string, c: Awaited<ReturnType<typeof loadContext>>, userMsg: string, answer: string, conversationId: string) {
  const pid = c.convo.project_id;
  const known = [...c.writerMem, ...c.projectMem].map((m: any) => m.content);
  const r = await json<{
    writer_memories?: { category: string; content: string }[];
    project_memories?: { category: string; content: string }[];
    bible?: { kind: string; name: string; notes: string }[];
    style?: string[];
  }>(
    `Extract only information of LASTING relevance stated or clearly confirmed by the WRITER (never by the assistant alone, never guessed). JSON:
{"writer_memories":[{"category":"preference|goal|background|process|dislike","content":"..."}],
 "project_memories":[{"category":"plot|character|setting|theme|decision","content":"..."}],
 "bible":[{"kind":"character|location|timeline|secret|foreshadowing|world_rule|relationship|object","name":"...","notes":"..."}],
 "style":["observations about the writer's own prose style, only if they shared their prose or corrected an edit"]}
${pid ? "" : "No novel is attached: project_memories and bible must be empty."}
Skip anything already known. Empty arrays are normal. Known:\n- ${known.join("\n- ") || "(none)"}`,
    `WRITER:\n${userMsg}\n\nASSISTANT:\n${answer.slice(0, 4000)}`,
  );
  if (!r) return;
  const norm = (s: string) => s.toLowerCase().replace(/\W+/g, " ").trim();
  const seen = new Set(known.map(norm));
  const rows = [
    ...(r.writer_memories ?? []).map((m) => ({ layer: "writer", project_id: null, ...m })),
    ...(pid ? (r.project_memories ?? []).map((m) => ({ layer: "project", project_id: pid, ...m })) : []),
  ]
    .filter((m) => m.content && !seen.has(norm(m.content)))
    .map((m) => ({ ...m, source_type: "conversation", source_ref: conversationId, source_excerpt: userMsg.slice(0, 300) }));
  if (rows.length) await db.from("memories").insert(rows);
  if (pid && r.bible?.length) {
    const existing = new Set(c.bible.map((b: any) => `${b.kind}:${norm(b.name)}`));
    const add = r.bible.filter((b) => b.name && !existing.has(`${b.kind}:${norm(b.name)}`)).map((b) => ({ project_id: pid, kind: b.kind, name: b.name, notes: b.notes }));
    if (add.length) await db.from("bible_entries").insert(add);
  }
  if (r.style?.length) {
    const prev = ((c.profile?.profile as any)?.observations ?? []) as string[];
    await db.from("writer_profile_versions").insert({
      version: (c.profile?.version ?? 0) + 1,
      profile: { observations: [...prev, ...r.style].slice(-40) },
      source: "conversation",
      change_note: r.style.join("; ").slice(0, 300),
    });
  }
  void userId;
}
