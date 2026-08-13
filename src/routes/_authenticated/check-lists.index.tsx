import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClipboardCheck, FilePlus2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocale, useT } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { pageHead } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { useActiveCertification } from "@/lib/certifications";
import {
  templatesFor,
  templateItemCount,
  useAuditChecklists,
  useCreateAuditChecklist,
  useDeleteAuditChecklist,
  type AuditChecklist,
} from "@/lib/audit-checklists";

export const Route = createFileRoute("/_authenticated/check-lists/")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "checklists", "/check-lists");
  },
  component: ChecklistsPage,
});

function ChecklistsPage() {
  const t = useT();
  const { locale, bcp47 } = useLocale();
  const navigate = useNavigate();
  const { certificationId } = useActiveCertification();
  const { data: audits = [], isLoading } = useAuditChecklists();
  const create = useCreateAuditChecklist();
  const remove = useDeleteAuditChecklist();
  const [pendingDelete, setPendingDelete] = useState<AuditChecklist | null>(null);

  const templates = templatesFor(locale);

  async function startFrom(templateId: string | null) {
    const template = templateId ? (templates.find((tpl) => tpl.id === templateId) ?? null) : null;
    try {
      const checklist = await create.mutateAsync({
        template,
        title: template ? template.title : t("audit.blankTemplate"),
        certificationId: certificationId ?? null,
      });
      toast.success(t("audit.created"));
      navigate({ to: "/check-lists/$auditId", params: { auditId: checklist.id } });
    } catch {
      toast.error(t("audit.errors.save"));
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success(t("audit.deleted"));
    } catch {
      toast.error(t("audit.errors.save"));
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("audit.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("audit.subtitle")}</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t("audit.myAudits")}
          </h2>
          {isLoading ? (
            <div className="h-24 animate-pulse rounded-lg border border-border bg-muted/40" />
          ) : audits.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
              {t("audit.noAudit")}
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {audits.map((audit) => (
                <li key={audit.id}>
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-snug">{audit.title}</CardTitle>
                        <Badge variant="secondary">{t(`audit.status.${audit.status}`)}</Badge>
                      </div>
                      <CardDescription>
                        {[
                          audit.audited_entity,
                          audit.audit_date
                            ? formatDate(new Date(`${audit.audit_date}T00:00:00`), bcp47, {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate({
                            to: "/check-lists/$auditId",
                            params: { auditId: audit.id },
                          })
                        }
                      >
                        {t("audit.open")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPendingDelete(audit)}
                        aria-label={t("audit.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t("audit.templates")}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <li key={template.id}>
                <Card className="flex h-full flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-primary">
                      <ClipboardCheck className="h-4 w-4" />
                      <span className="text-xs font-medium">{template.standard}</span>
                    </div>
                    <CardTitle className="text-base leading-snug">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t("audit.itemsCount", { count: templateItemCount(template) })}
                    </span>
                    <Button size="sm" disabled={create.isPending} onClick={() => startFrom(template.id)}>
                      {t("audit.start")}
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
            <li>
              <Card className="flex h-full flex-col border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FilePlus2 className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base leading-snug">{t("audit.blankTemplate")}</CardTitle>
                  <CardDescription>{t("audit.blankTemplateDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={create.isPending}
                    onClick={() => startFrom(null)}
                  >
                    {t("audit.start")}
                  </Button>
                </CardContent>
              </Card>
            </li>
          </ul>
        </section>
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("audit.delete")}</AlertDialogTitle>
            <AlertDialogDescription>{t("audit.deleteConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t("audit.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
