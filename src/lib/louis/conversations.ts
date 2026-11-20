import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const conversationsQuery = queryOptions({
  queryKey: ["conversations"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("id, title, updated_at, project_id, projects(title)")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return data;
  },
});

export const conversationQuery = (id: string) =>
  queryOptions({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const [c, m] = await Promise.all([
        supabase.from("conversations").select("id, title, project_id, projects(title)").eq("id", id).single(),
        supabase.from("messages").select("id, role, content, parts, created_at").eq("conversation_id", id).order("created_at"),
      ]);
      if (c.error) throw c.error;
      if (m.error) throw m.error;
      return { conversation: c.data, messages: m.data };
    },
  });

export const PENDING_KEY = (id: string) => `louis-pending-${id}`;
