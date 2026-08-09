import * as React from "react";
import { Link, Text, Hr } from "@react-email/components";

export const SITE_NAME = "PREPA CERTIF";
export const SENDER_DOMAIN = "notify.prepa-certif.app";
export const ROOT_DOMAIN = "prepa-certif.app";
export const FROM_DOMAIN = "prepa-certif.app";
export const SITE_URL = `https://${ROOT_DOMAIN}`;
export const CONTACT_EMAIL = "contact@prepa-certif.app";

export const colors = {
  background: "#ffffff",
  foreground: "#1f2937",
  muted: "#6b7280",
  primary: "#1e3a5f",
  primaryForeground: "#ffffff",
  border: "#e5e7eb",
  lightBg: "#f8fafc",
} as const;

export const fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

export const main = {
  backgroundColor: colors.background,
  fontFamily,
  padding: "40px 20px",
};

export const container = {
  maxWidth: "480px",
  margin: "0 auto",
  backgroundColor: colors.background,
  borderRadius: "12px",
  padding: "32px",
  border: `1px solid ${colors.border}`,
};

export const h1 = {
  fontSize: "22px",
  fontWeight: "700" as const,
  color: colors.foreground,
  margin: "0 0 20px",
  lineHeight: "1.3",
};

export const text = {
  fontSize: "15px",
  color: colors.foreground,
  lineHeight: "1.6",
  margin: "0 0 20px",
};

export const textSmall = {
  ...text,
  fontSize: "14px",
};

export const link = {
  color: colors.primary,
  textDecoration: "underline",
};

export const button = {
  display: "inline-block",
  backgroundColor: colors.primary,
  color: colors.primaryForeground,
  fontSize: "15px",
  fontWeight: "600" as const,
  borderRadius: "8px",
  padding: "14px 28px",
  textDecoration: "none",
  textAlign: "center" as const,
};

export const footer = {
  fontSize: "13px",
  color: colors.muted,
  lineHeight: "1.5",
  margin: "32px 0 0",
};

export const footerLinks = {
  ...footer,
  margin: "12px 0 0",
};

export const codeStyle = {
  fontFamily: '"SF Mono", Monaco, "Courier New", monospace',
  fontSize: "28px",
  fontWeight: "700" as const,
  letterSpacing: "0.08em",
  color: colors.primary,
  backgroundColor: colors.lightBg,
  borderRadius: "8px",
  padding: "16px 24px",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

export function EmailLogo() {
  return (
    <div style={{ marginBottom: "24px" }}>
      <svg
        viewBox="0 0 64 64"
        width="48"
        height="48"
        role="img"
        aria-label={SITE_NAME}
      >
        <title>{SITE_NAME}</title>
        <circle cx="32" cy="32" r="30" fill="none" stroke={colors.primary} strokeWidth="3" />
        <circle cx="32" cy="32" r="23" fill={colors.primary} />
        <g
          fill="none"
          stroke={colors.background}
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
          stroke={colors.background}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function EmailFooter() {
  return (
    <>
      <Hr style={{ borderColor: colors.border, margin: "32px 0 20px" }} />
      <Text style={footer}>
        Vous recevez cet e-mail de la part de <strong>{SITE_NAME}</strong>.
        <br />
        En cas de question, contactez-nous à{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`} style={link}>
          {CONTACT_EMAIL}
        </Link>
        .
      </Text>
      <Text style={footerLinks}>
        <Link href={`${SITE_URL}/mentions-legales`} style={link}>
          Mentions légales
        </Link>
        {" · "}
        <Link href={`${SITE_URL}/confidentialite`} style={link}>
          Politique de confidentialité
        </Link>
        {" · "}
        <Link href={`${SITE_URL}/cgu`} style={link}>
          CGU
        </Link>
      </Text>
    </>
  );
}
