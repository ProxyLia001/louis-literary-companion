import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BookOpen, Feather, FlaskConical, Home, LibraryBig, Brain, ScrollText, UserRound, LogOut, Menu, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/writing-room", label: "Writing Room", icon: Feather },
  { to: "/editor", label: "Editor", icon: ScrollText },
  { to: "/research", label: "Research Lab", icon: FlaskConical },
  { to: "/library", label: "My Library", icon: LibraryBig },
  { to: "/story-bible", label: "Story Bible", icon: BookOpen },
  { to: "/writer-profile", label: "Writer Profile", icon: UserRound },
  { to: "/memory", label: "Memory", icon: Brain },
] as const;

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
        >
          <Icon className="h-4 w-4 opacity-80" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/home" className="block px-3">
      <span className="font-display text-3xl italic text-foreground">Louis</span>
      <span className="block text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
        Literary partner
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-8 border-r border-sidebar-border bg-sidebar py-8 px-3 md:flex">
        <Brand />
        <Nav />
        <Button variant="ghost" className="mt-auto justify-start gap-3 text-muted-foreground" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <Brand />
          <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
        </header>
        {open && (
          <div className="fixed inset-0 z-50 flex flex-col gap-8 bg-sidebar p-6 md:hidden">
            <div className="flex items-center justify-between">
              <Brand />
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X />
              </Button>
            </div>
            <Nav onNavigate={() => setOpen(false)} />
            <Button variant="ghost" className="mt-auto justify-start gap-3" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        )}
        <main className={cn("mx-auto w-full max-w-5xl flex-1 px-5 py-8 md:px-10 md:py-12 fade-in")}>{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
        <h1 className="text-4xl text-foreground md:text-5xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function UpcomingPhase({ phase, title, points }: { phase: number; title: string; points: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 page-shadow">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Arrives in Phase {phase}</p>
      <h2 className="mt-2 text-2xl">{title}</h2>
      <ul className="manuscript mt-4 space-y-1 text-muted-foreground">
        {points.map((p) => <li key={p}>— {p}</li>)}
      </ul>
    </div>
  );
}
