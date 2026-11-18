import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/louis/AppShell";
import { NewProjectDialog } from "@/components/louis/NewProjectDialog";
import { projectsQuery } from "@/lib/projects";

export const Route = createFileRoute("/_authenticated/library/")({
  head: () => ({ meta: [
    { title: "My Library — Louis" }, { name: "description", content: "Your novels, chapters and drafts." },
    { property: "og:title", content: "My Library — Louis" }, { property: "og:description", content: "Your novels, chapters and drafts." },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  component: LibraryPage,
});

function LibraryPage() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  return (
    <>
      <PageHeader eyebrow="My Library" title="The shelves"><NewProjectDialog /></PageHeader>
      {projects.length === 0 && <p className="manuscript text-muted-foreground">No projects yet. Every novel begins with a title — even a provisional one.</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <Link key={p.id} to="/library/$projectId" params={{ projectId: p.id }}
            className="group rounded-lg border border-border bg-card p-6 page-shadow transition-colors hover:border-primary/50">
            <p className="text-xs uppercase tracking-widest text-gold">{p.genre || "Untitled genre"}</p>
            <h2 className="mt-2 text-2xl group-hover:text-primary">{p.title}</h2>
            {p.synopsis && <p className="manuscript mt-3 line-clamp-3 text-sm text-muted-foreground">{p.synopsis}</p>}
            <p className="mt-4 text-xs text-muted-foreground">
              {p.chapters.length} chapters · {p.chapters.reduce((a, c) => a + c.word_count, 0).toLocaleString()} words
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
