import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/louis/AppShell";
import { projectsQuery } from "@/lib/projects";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [
    { title: "Home — Louis" }, { name: "description", content: "Your writing desk." },
    { property: "og:title", content: "Home — Louis" }, { property: "og:description", content: "Your writing desk." },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  component: HomePage,
});

function HomePage() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const words = projects.reduce((s, p) => s + p.chapters.reduce((a, c) => a + c.word_count, 0), 0);
  const chapters = projects.reduce((s, p) => s + p.chapters.length, 0);
  return (
    <>
      <PageHeader eyebrow="Your desk" title="Good to see you." />
      <div className="grid grid-cols-3 gap-4">
        {[["Projects", projects.length], ["Chapters", chapters], ["Words", words.toLocaleString()]].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{l}</p>
            <p className="mt-2 font-display text-3xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-2xl">Recent projects</h2>
        <Button asChild variant="outline" size="sm"><Link to="/library">Open library</Link></Button>
      </div>
      {projects.length === 0 ? (
        <p className="manuscript mt-6 text-muted-foreground">
          Nothing on the desk yet. <Link to="/library" className="text-primary underline-offset-4 hover:underline">Begin your first project</Link>.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
          {projects.slice(0, 5).map((p) => (
            <li key={p.id}>
              <Link to="/library/$projectId" params={{ projectId: p.id }} className="flex items-baseline justify-between gap-4 px-5 py-4 hover:bg-accent/40">
                <span className="font-display text-xl">{p.title}</span>
                <span className="text-xs text-muted-foreground">edited {formatDistanceToNow(new Date(p.updated_at))} ago</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
