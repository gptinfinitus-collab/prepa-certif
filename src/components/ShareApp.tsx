import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SHARE_URL = "https://prepa-certif.app";
const SHARE_TITLE = "PREPA CERTIF";
const SHARE_TEXT =
  "Prépare ta certification ISO avec PREPA CERTIF : cours structurés, quiz et assistant IA.";

/** Boutons de partage de l'application (partage natif + copie du lien). */
export function ShareApp() {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast.success("Lien copié.");
    } catch {
      toast.error("Copie impossible sur cet appareil.");
    }
  }

  async function share() {
    if (canShare) {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => void share()}>
        <Share2 className="size-4" aria-hidden />
        Partager
      </Button>
      <Button variant="outline" onClick={() => void copyLink()}>
        {copied ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
        Copier le lien
      </Button>
    </div>
  );
}
