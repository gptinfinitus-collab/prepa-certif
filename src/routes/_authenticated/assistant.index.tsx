import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useActiveCertification } from "@/lib/certifications";
import { useCreateThread, useThreads } from "@/lib/threads";

export const Route = createFileRoute("/_authenticated/assistant/")({
  head: () => ({
    meta: [
      { title: "Assistant IA — PREPA ISO" },
      {
        name: "description",
        content:
          "Posez vos questions sur les normes ISO et l'audit : l'assistant répond en streaming en s'appuyant sur vos documents indexés.",
      },
      { property: "og:title", content: "Assistant IA — PREPA ISO" },
      {
        property: "og:description",
        content: "Un tuteur IA qui répond à partir de votre bibliothèque de cours ISO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssistantIndexPage,
});

function AssistantIndexPage() {
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
    <AppShell title="Assistant IA">
      <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Ouverture de votre conversation…
      </div>
    </AppShell>
  );
}
