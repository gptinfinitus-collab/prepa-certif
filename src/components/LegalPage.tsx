import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { legalDocuments, legalInfo, type LegalDocument } from "@/lib/legal";
import { ArrowLeft } from "lucide-react";

type LegalPageProps = {
  doc: LegalDocument;
  children: ReactNode;
};

/** Mise en page commune aux pages légales (publique, lisible, indexable). */
export function LegalPage({ doc, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <BrandLogo className="size-7 text-primary" />
            {legalInfo.appName}
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Connexion
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">{doc.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dernière mise à jour : {legalInfo.updatedAt}
        </p>
        <div className="prose mt-8 max-w-none">{children}</div>
      </main>

      <footer className="border-t border-border">
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted-foreground">
          {legalDocuments.map((item) => (
            <Link key={item.slug} to={item.path} className="hover:text-foreground">
              {item.title}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
