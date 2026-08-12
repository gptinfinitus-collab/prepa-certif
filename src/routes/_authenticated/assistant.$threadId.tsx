import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AssistantChat } from "@/components/AssistantChat";
import { useT } from "@/i18n";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/_authenticated/assistant/$threadId")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "assistantThread", "/assistant/$threadId");
  },
  component: AssistantThreadPage,
});

function AssistantThreadPage() {
  const t = useT();
  const { threadId } = useParams({ from: "/_authenticated/assistant/$threadId" });
  return (
    <AppShell title={t("nav.assistant")}>
      <AssistantChat key={threadId} threadId={threadId} />
    </AppShell>
  );
}
