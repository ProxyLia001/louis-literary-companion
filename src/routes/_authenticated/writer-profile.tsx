import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, UpcomingPhase } from "@/components/louis/AppShell";

export const Route = createFileRoute("/_authenticated/writer-profile")({
  head: () => ({ meta: [
    { title: "Writer Profile — Louis" }, { name: "description", content: "How Louis understands your voice." },
    { property: "og:title", content: "Writer Profile — Louis" }, { property: "og:description", content: "How Louis understands your voice." },
  ] }),
  component: () => (
    <>
      <PageHeader eyebrow="Writer Profile" title="How Louis understands your voice" />
      <UpcomingPhase phase={2} title="What this room will do" points={['Sentence rhythm, vocabulary, dialogue, imagery, pacing and tone', 'Learned from conversations, corrections, accepted and rejected edits', 'Natural style separated from experiments', 'Every change versioned — nothing overwritten']} />
    </>
  ),
});
