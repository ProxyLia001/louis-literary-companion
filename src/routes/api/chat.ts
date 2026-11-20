import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        if (token.split(".").length !== 3) return new Response("Unauthorized", { status: 401 });
        const { userClient, handleChat } = await import("@/lib/louis/chat.server");
        const db = userClient(token);
        const { data, error } = await db.auth.getClaims(token);
        if (error || !data?.claims?.sub) return new Response("Unauthorized", { status: 401 });
        const body = (await request.json().catch(() => null)) as { conversationId?: string; content?: string } | null;
        const content = body?.content?.trim();
        if (!body?.conversationId || !content || content.length > 60000) return new Response("Bad request", { status: 400 });
        try {
          return await handleChat(db, data.claims.sub, body.conversationId, content);
        } catch (e) {
          console.error(e);
          return new Response("Conversation not found", { status: 404 });
        }
      },
    },
  },
});
