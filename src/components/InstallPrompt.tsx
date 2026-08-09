import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "prepa_certif_install_prompt";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  return (
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1)
  );
}

/**
 * Invite d'installation PWA affichée une seule fois (premier passage).
 * Aucun service worker : uniquement l'installabilité via le manifeste.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.self !== window.top) return; // aperçu en iframe
    if (isStandalone()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const onInstalled = () => {
      localStorage.setItem(STORAGE_KEY, "installed");
      setVisible(false);
    };
    window.addEventListener("appinstalled", onInstalled);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isIos() && /safari/i.test(window.navigator.userAgent)) {
      timer = setTimeout(() => {
        setIosHint(true);
        setVisible(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setVisible(false);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    localStorage.setItem(STORAGE_KEY, "prompted");
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="relative flex w-full max-w-md items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg">
        <BrandLogo className="mt-0.5 size-10 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Installer PREPA CERTIF</p>
          {iosHint ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Dans Safari, touchez <Share className="inline size-3.5 align-[-2px]" /> Partager, puis
              « Sur l'écran d'accueil » pour installer l'application.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Accédez à votre préparation directement depuis votre écran d'accueil ou votre bureau.
            </p>
          )}
          <div className="mt-3 flex gap-2">
            {iosHint ? (
              <Button size="sm" onClick={dismiss}>
                J'ai compris
              </Button>
            ) : (
              <>
                <Button size="sm" onClick={install}>
                  <Download className="size-4" />
                  Installer
                </Button>
                <Button size="sm" variant="ghost" onClick={dismiss}>
                  Plus tard
                </Button>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer l'invite d'installation"
          className="absolute right-2 top-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
