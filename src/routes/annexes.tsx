import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz } from "@/components/Quiz";
import { useCurriculum } from "@/lib/curriculum";
import { useT } from "@/i18n";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/annexes")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "annexes", "/annexes");
  },
  component: Annexes,
});

function Annexes() {
  const t = useT();
  const { curriculum } = useCurriculum();
  const { annexes } = curriculum;

  return (
    <AppShell title={t("common.annexes")}>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.annexes")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("common.annexesIntro")}
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sans text-lg">{t("common.auditPlanTemplateTitle")}</CardTitle>
            <CardDescription>{t("common.auditPlanTemplateDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {annexes.auditPlanTemplate.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-sans text-lg">{t("common.ncTemplateTitle")}</CardTitle>
            <CardDescription>{t("common.ncTemplateDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              {annexes.ncTemplate.map((field) => (
                <div key={field.field} className="py-2">
                  <dt className="text-sm font-medium">{field.field}</dt>
                  <dd className="text-sm text-muted-foreground">{field.hint}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-sans text-lg">{t("common.genericChecklistTitle")}</CardTitle>
            <CardDescription>{t("common.genericChecklistDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {annexes.genericChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <section className="mt-10">
          <h2 className="font-sans text-2xl font-semibold">{t("common.finalMockExamTitle")}</h2>
          {annexes.finalMockExam.mcq.length > 0 ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("common.finalMockExamIntro")}
              </p>
              <div className="mt-4">
                <Quiz items={annexes.finalMockExam.mcq} />
              </div>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("common.noMockExam")}
            </p>
          )}
        </section>

      </div>
    </AppShell>
  );
}
