import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useActiveCertification } from "@/lib/certifications";
import { useCreateThread, useThreads } from "@/lib/threads";
import { useT } from "@/i18n";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/_authenticated/assistant/")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "assistant", "/assistant");
  },
  component: AssistantIndexPage,
});

function AssistantIndexPage() {
  const t = useT();
  const navigate = useNavigate();
  const { certificationId } = useActiveCertification();
  const threads = useThreads(certificationId ?? null);
  const createThread = useCreateThread();

  useEffect(() => {
    if (!threads.isSuccess || createThread.isPending) return;
    const latest = threads.data[0];
    if (latest) {
      navigate({ to: "/assistant/$threadId", params: { threadId: latest.id }, replace: true });
      return;
    }
    createThread.mutateAsync(certificationId ?? null).then((thread) => {
      navigate({ to: "/assistant/$threadId", params: { threadId: thread.id }, replace: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads.isSuccess, threads.data, certificationId]);

  return (
    <AppShell title={t("nav.assistant")}>
      <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {t("common.openingConversation")}
      </div>
    </AppShell>
  );
}
