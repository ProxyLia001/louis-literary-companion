import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, UpcomingPhase } from "@/components/louis/AppShell";

export const Route = createFileRoute("/_authenticated/editor")({
  head: () => ({ meta: [
    { title: "Editor — Louis" }, { name: "description", content: "Five intensities of editing." },
    { property: "og:title", content: "Editor — Louis" }, { property: "og:description", content: "Five intensities of editing." },
  ] }),
  component: () => (
    <>
      <PageHeader eyebrow="Editor" title="Five intensities of editing" />
      <UpcomingPhase phase={3} title="What this room will do" points={['Proofreading, light, literary, developmental and intensive rewriting', 'Original and edited text side by side; your original is never overwritten', "Accept or reject each suggestion, with Louis's reasoning", 'Good sentences are left alone']} />
    </>
  ),
});
