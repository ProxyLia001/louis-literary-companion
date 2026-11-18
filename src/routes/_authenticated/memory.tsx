import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, UpcomingPhase } from "@/components/louis/AppShell";

export const Route = createFileRoute("/_authenticated/memory")({
  head: () => ({ meta: [
    { title: "Memory — Louis" }, { name: "description", content: "Everything Louis remembers, in the open." },
    { property: "og:title", content: "Memory — Louis" }, { property: "og:description", content: "Everything Louis remembers, in the open." },
  ] }),
  component: () => (
    <>
      <PageHeader eyebrow="Memory" title="Everything Louis remembers, in the open" />
      <UpcomingPhase phase={2} title="What this room will do" points={['Writer memory and per-project memory', 'View, correct and delete any memory', 'Each memory shows where it came from', "Louis never pretends to remember what it doesn't"]} />
    </>
  ),
});
