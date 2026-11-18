import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.from("projects")
      .insert({ title: title.trim(), genre: genre || null, synopsis: synopsis || null }).select("id").single();
    setBusy(false);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["projects"] });
    setOpen(false);
    navigate({ to: "/library/$projectId", params: { projectId: data.id } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> New project</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display text-2xl">A new project</DialogTitle></DialogHeader>
        <form onSubmit={create} className="grid gap-4">
          <div className="grid gap-1.5"><Label htmlFor="np-title">Title</Label><Input id="np-title" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="grid gap-1.5"><Label htmlFor="np-genre">Genre</Label><Input id="np-genre" placeholder="Psychological thriller" value={genre} onChange={(e) => setGenre(e.target.value)} /></div>
          <div className="grid gap-1.5"><Label htmlFor="np-syn">Synopsis (optional)</Label><Textarea id="np-syn" rows={4} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} /></div>
          <Button type="submit" disabled={busy}>Create project</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
