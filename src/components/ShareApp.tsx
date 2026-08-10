import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Mail, MessageSquare, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SHARE_URL = "https://prepa-certif.app";
const SHARE_TITLE = "PREPA CERTIF";
const SHARE_TEXT =
  "Prépare ta certification ISO avec PREPA CERTIF : cours structurés, quiz et assistant IA.";
const SHARE_MESSAGE = `${SHARE_TITLE} — ${SHARE_TEXT} ${SHARE_URL}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-6", className)}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-9.213A9.995 9.995 0 0 0 12 2a9.996 9.996 0 0 0-8.684 15.006l-1.11 4.052 4.147-1.089A9.996 9.996 0 1 0 12.051 5.169z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-6", className)}
      aria-hidden
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.095 10.125 24v-8.437H7.078v-3.49h3.047V9.697c0-3.023 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.953H15.83c-1.49 0-1.955.931-1.955 1.887v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.1 24 12.073z" />
    </svg>
  );
}

interface ShareOptionProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
}

function ShareOption({ label, icon, onClick, colorClass }: ShareOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-2 transition-all hover:border-primary/30 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-2 sm:p-3"
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full text-white shadow-sm transition-transform group-hover:scale-110 sm:size-12",
          colorClass,
        )}
      >
        {icon}
      </div>
      <span className="text-[11px] font-medium text-foreground sm:text-xs">{label}</span>
    </button>
  );
}

/** Bouton de partage de l'application avec options natives, WhatsApp, email, SMS et copie. */
export function ShareApp() {
  const [open, setOpen] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_MESSAGE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast.success("Lien copié dans le presse-papiers.");
    } catch {
      toast.error("Copie impossible sur cet appareil.");
    }
  }

  async function nativeShare() {
    if (canShare) {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL });
        setOpen(false);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setOpen(false);
          return;
        }
      }
    }
    await copyLink();
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(SHARE_MESSAGE);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  function shareFacebook() {
    const url = encodeURIComponent(SHARE_URL);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(SHARE_TEXT)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setOpen(false);
  }

  function shareEmail() {
    const subject = encodeURIComponent(`Découvre ${SHARE_TITLE}`);
    const body = encodeURIComponent(SHARE_MESSAGE);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setOpen(false);
  }

  function shareSMS() {
    const body = encodeURIComponent(SHARE_MESSAGE);
    window.location.href = `sms:?body=${body}`;
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Share2 className="size-4" aria-hidden />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] overflow-hidden rounded-2xl p-4 sm:max-w-md sm:p-6">
        <DialogHeader>
          <DialogTitle>Partager PREPA CERTIF</DialogTitle>
          <DialogDescription>
            Invite tes contacts à préparer leur certification ISO avec toi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 py-4 sm:grid-cols-5 sm:gap-3">
          <ShareOption
            label="WhatsApp"
            icon={<WhatsAppIcon />}
            onClick={shareWhatsApp}
            colorClass="bg-[#25D366]"
          />
          <ShareOption
            label="Facebook"
            icon={<FacebookIcon />}
            onClick={shareFacebook}
            colorClass="bg-[#1877F2]"
          />
          <ShareOption
            label="Email"
            icon={<Mail className="size-6" aria-hidden />}
            onClick={shareEmail}
            colorClass="bg-blue-500"
          />
          <ShareOption
            label="SMS"
            icon={<MessageSquare className="size-6" aria-hidden />}
            onClick={shareSMS}
            colorClass="bg-purple-500"
          />
          {canShare && (
            <ShareOption
              label="Natif"
              icon={<Share2 className="size-6" aria-hidden />}
              onClick={nativeShare}
              colorClass="bg-primary"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Aperçu du message</span>
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted p-3">
            <p className="min-w-0 flex-1 truncate text-sm text-foreground">{SHARE_MESSAGE}</p>
            <Button variant="ghost" size="icon" onClick={() => void copyLink()} aria-label="Copier le lien">
              {copied ? (
                <Check className="size-4 text-green-500" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
