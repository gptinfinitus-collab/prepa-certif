import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeCheck,
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Leaf,
  Lock,
  Recycle,
  Scale,
  ShieldCheck,
  Target,
} from "lucide-react";

type Placed = {
  Icon: LucideIcon;
  size: number;
  rotate: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

export const authBackgroundIcons: Placed[] = [
  { Icon: ShieldCheck, top: "5%", left: "8%", size: 56, rotate: -15 },
  { Icon: FileCheck2, top: "12%", right: "10%", size: 64, rotate: 10 },
  { Icon: ClipboardCheck, top: "25%", left: "5%", size: 48, rotate: 20 },
  { Icon: BookOpen, bottom: "30%", right: "6%", size: 60, rotate: -8 },
  { Icon: Award, top: "8%", left: "40%", size: 44, rotate: 25 },
  { Icon: BadgeCheck, bottom: "15%", left: "12%", size: 56, rotate: -20 },
  { Icon: Scale, top: "40%", right: "12%", size: 42, rotate: 15 },
  { Icon: Target, bottom: "10%", right: "25%", size: 52, rotate: -12 },
  { Icon: Recycle, top: "60%", left: "6%", size: 46, rotate: 8 },
  { Icon: Leaf, bottom: "8%", left: "35%", size: 40, rotate: -25 },
  { Icon: Lock, top: "18%", left: "25%", size: 42, rotate: 18 },
  { Icon: GraduationCap, bottom: "25%", right: "30%", size: 38, rotate: -10 },
];

/**
 * Décor de la page de connexion : icônes flottantes discrètes + halo de marque.
 * Toutes les couleurs proviennent des tokens sémantiques (--primary / --glow).
 */
export function AuthBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
        {authBackgroundIcons.map(({ Icon, size, rotate, ...pos }, i) => (
          <Icon
            key={i}
            data-testid="auth-bg-icon"
            className="absolute text-primary"
            style={{
              ...pos,
              width: size,
              height: size,
              opacity: 0.12,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div
        aria-hidden
        data-testid="auth-glow"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 translate-y-16"
      >
        <div
          className="h-[300px] w-[600px] animate-pulse rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--glow, var(--primary)) 55%, transparent), transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[140px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--glow, var(--primary)) 75%, transparent), transparent 70%)",
          }}
        />
      </div>
    </>
  );
}
