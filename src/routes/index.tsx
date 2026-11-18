import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Louis — An AI literary partner" },
      { name: "description", content: "Louis learns your voice, keeps your story bible, researches honestly and edits without erasing you." },
      { property: "og:title", content: "Louis — An AI literary partner" },
      { property: "og:description", content: "An AI that understands how you write before it tries to improve it." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center fade-in">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">A literary partner</p>
      <h1 className="mt-6 text-7xl italic md:text-8xl">Louis</h1>
      <p className="manuscript mt-6 max-w-xl text-muted-foreground">
        Understand the writer before attempting to improve the writing. Louis learns your voice,
        keeps your story's continuity, researches with real sources — and tells you honestly when
        an idea isn't working yet.
      </p>
      <Button asChild size="lg" className="mt-10">
        <Link to="/auth">Enter the study</Link>
      </Button>
      <p className="mt-6 text-xs text-muted-foreground">Louis is an AI. Your manuscripts stay private to you.</p>
    </div>
  );
}
