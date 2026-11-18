import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, UpcomingPhase } from "@/components/louis/AppShell";

export const Route = createFileRoute("/_authenticated/story-bible")({
  head: () => ({ meta: [
    { title: "Story Bible — Louis" }, { name: "description", content: "Continuity for every novel." },
    { property: "og:title", content: "Story Bible — Louis" }, { property: "og:description", content: "Continuity for every novel." },
  ] }),
  component: () => (
    <>
      <PageHeader eyebrow="Story Bible" title="Continuity for every novel" />
      <UpcomingPhase phase={3} title="What this room will do" points={['Characters, locations, timelines, secrets, symbols and world rules', "New chapters checked against what's already established", 'Contradictions flagged and asked about — never silently resolved', "Each novel's information kept strictly separate"]} />
    </>
  ),
});
