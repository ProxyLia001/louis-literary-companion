import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, UpcomingPhase } from "@/components/louis/AppShell";

export const Route = createFileRoute("/_authenticated/research")({
  head: () => ({ meta: [
    { title: "Research Lab — Louis" }, { name: "description", content: "Research with real sources." },
    { property: "og:title", content: "Research Lab — Louis" }, { property: "og:description", content: "Research with real sources." },
  ] }),
  component: () => (
    <>
      <PageHeader eyebrow="Research Lab" title="Research with real sources" />
      <UpcomingPhase phase={4} title="What this room will do" points={['Searches PubMed, Europe PMC and Crossref before making factual claims', 'Citations with links; unverifiable sources clearly flagged', 'Facts separated from hypotheses and speculation', 'Briefs you can save to a project']} />
    </>
  ),
});
