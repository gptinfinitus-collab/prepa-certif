import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AssistantChat } from "@/components/AssistantChat";

export const Route = createFileRoute("/_authenticated/assistant/$threadId")({
  head: () => ({
    meta: [
      { title: "Conversation — Assistant IA PREPA ISO" },
      {
        name: "description",
        content:
          "Fil de conversation avec l'assistant IA : réponses en streaming appuyées sur la norme active et vos documents indexés.",
      },
      { property: "og:title", content: "Conversation — Assistant IA PREPA ISO" },
      {
        property: "og:description",
        content: "Vos échanges avec le tuteur IA, conservés par certification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssistantThreadPage,
});

function AssistantThreadPage() {
  const { threadId } = useParams({ from: "/_authenticated/assistant/$threadId" });
  return (
    <AppShell title="Assistant IA">
      <AssistantChat key={threadId} threadId={threadId} />
    </AppShell>
  );
}
