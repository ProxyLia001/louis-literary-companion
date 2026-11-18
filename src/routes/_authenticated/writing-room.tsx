import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, UpcomingPhase } from "@/components/louis/AppShell";

export const Route = createFileRoute("/_authenticated/writing-room")({
  head: () => ({ meta: [
    { title: "Writing Room — Louis" }, { name: "description", content: "Conversations with Louis." },
    { property: "og:title", content: "Writing Room — Louis" }, { property: "og:description", content: "Conversations with Louis." },
  ] }),
  component: () => (
    <>
      <PageHeader eyebrow="Writing Room" title="Conversations with Louis" />
      <UpcomingPhase phase={2} title="What this room will do" points={['Natural, long-form conversation for brainstorming, critique and collaborative writing', "Project-specific chats that draw on that novel's Story Bible", 'Searchable, saved conversation history', 'Louis disagrees honestly when an idea is weak']} />
    </>
  ),
});
