import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  title?: string;
};

/**
 * Marque PREPA ISO — inspirée des sceaux de certification ISO :
 * anneau extérieur, disque plein, globe méridien et coche de conformité.
 * Le disque utilise `currentColor` pour s'adapter à la certification active.
 */
export function BrandLogo({ className, title = "PREPA ISO" }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("size-6", className)}
    >
      <title>{title}</title>
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="32" r="23" fill="currentColor" />
      <g
        fill="none"
        stroke="var(--color-background)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      >
        <circle cx="32" cy="32" r="16.5" />
        <ellipse cx="32" cy="32" rx="7.5" ry="16.5" />
        <path d="M16.5 26h31M16.5 38h31" />
      </g>
      <path
        d="M23 33.5 29.5 40 42 26.5"
        fill="none"
        stroke="var(--color-background)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
