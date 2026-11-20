import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { conversationQuery } from "@/lib/louis/conversations";
import { ChatThread, type ChatMsg } from "@/components/louis/Chat";

export const Route = createFileRoute("/_authenticated/chat/$conversationId")({
  head: () => ({ meta: [
    { title: "Conversation — Louis" }, { name: "description", content: "A conversation with Louis, your literary partner." },
    { property: "og:title", content: "Conversation — Louis" }, { property: "og:description", content: "A conversation with Louis." },
  ] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(conversationQuery(params.conversationId)),
  component: ChatPage,
});

function ChatPage() {
  const { conversationId } = Route.useParams();
  const { data } = useSuspenseQuery(conversationQuery(conversationId));
  const initial: ChatMsg[] = data.messages.map((m) => ({ id: m.id, role: m.role, content: m.content, sources: (m.parts as any)?.sources }));
  const novel = (data.conversation as any).projects?.title as string | undefined;
  return (
    <>
      <div className="mb-8 border-b border-border pb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">{novel ? `On “${novel}”` : "Open conversation"}</p>
        <h1 className="mt-1 line-clamp-2 text-2xl md:text-3xl">{data.conversation.title}</h1>
      </div>
      <ChatThread key={conversationId} conversationId={conversationId} initial={initial} />
    </>
  );
}
