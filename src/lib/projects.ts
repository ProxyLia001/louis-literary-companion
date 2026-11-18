import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function countWords(text: string) {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, chapters(word_count)")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const projectQuery = (id: string) =>
  queryOptions({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, chapters(id, title, position, word_count, updated_at)")
        .eq("id", id)
        .single();
      if (error) throw error;
      data.chapters.sort((a, b) => a.position - b.position);
      return data;
    },
  });

export const chapterQuery = (id: string) =>
  queryOptions({
    queryKey: ["chapter", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("chapters").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });
