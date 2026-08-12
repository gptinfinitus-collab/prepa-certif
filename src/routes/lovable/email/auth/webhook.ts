import * as React from "react";
import { createAuthEmailHandler, type AuthEmailHookData } from "@lovable.dev/email-js";
import { createFileRoute } from "@tanstack/react-router";
import { SignupEmail } from "@/lib/email-templates/signup";
import { InviteEmail } from "@/lib/email-templates/invite";
import { MagicLinkEmail } from "@/lib/email-templates/magic-link";
import { RecoveryEmail } from "@/lib/email-templates/recovery";
import { EmailChangeEmail } from "@/lib/email-templates/email-change";
import { ReauthenticationEmail } from "@/lib/email-templates/reauthentication";
import { SITE_NAME, SENDER_DOMAIN, FROM_DOMAIN, SITE_URL, type EmailLocale } from "@/lib/email-templates/email-brand";
import { isLocale } from "@/i18n/config";

function rewriteConfirmationUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hostname = "prepa-certif.app";
    parsed.protocol = "https:";
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Resolves the recipient's locale from the webhook payload, defaulting to French. */
function resolveLocale(data: AuthEmailHookData): EmailLocale {
  const raw = data as unknown as {
    user_metadata?: { locale?: unknown };
    user?: { user_metadata?: { locale?: unknown } };
  };
  const candidate = raw.user_metadata?.locale ?? raw.user?.user_metadata?.locale ?? "fr";
  return isLocale(candidate) ? candidate : "fr";
}

// The SDK handler owns verification, dispatch, and retry semantics; this file
// owns only the email decisions: subjects, templates, and per-type props.
const handler = createAuthEmailHandler({
  apiKey: process.env["LOVABLE_API_KEY"]!,
  from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
  senderDomain: SENDER_DOMAIN,
  sendUrl: process.env["LOVABLE_SEND_URL"],
  emails: {
    signup: {
      subject: `Confirmez votre compte — ${SITE_NAME}`,
      render: (data: AuthEmailHookData) =>
        React.createElement(SignupEmail, {
          siteName: SITE_NAME,
          siteUrl: SITE_URL,
          recipient: data.email,
          confirmationUrl: rewriteConfirmationUrl(data.url),
          locale: resolveLocale(data),
        }),
    },
    invite: {
      subject: `Vous avez été invité sur ${SITE_NAME}`,
      render: (data: AuthEmailHookData) =>
        React.createElement(InviteEmail, {
          siteName: SITE_NAME,
          siteUrl: SITE_URL,
          confirmationUrl: rewriteConfirmationUrl(data.url),
          locale: resolveLocale(data),
        }),
    },
    magiclink: {
      subject: `Votre lien de connexion — ${SITE_NAME}`,
      render: (data: AuthEmailHookData) =>
        React.createElement(MagicLinkEmail, {
          siteName: SITE_NAME,
          confirmationUrl: rewriteConfirmationUrl(data.url),
          locale: resolveLocale(data),
        }),
    },
    recovery: {
      subject: `Réinitialisation de votre mot de passe — ${SITE_NAME}`,
      render: (data: AuthEmailHookData) =>
        React.createElement(RecoveryEmail, {
          siteName: SITE_NAME,
          confirmationUrl: rewriteConfirmationUrl(data.url),
          locale: resolveLocale(data),
        }),
    },
    email_change: {
      subject: `Confirmez votre nouvelle adresse e-mail — ${SITE_NAME}`,
      render: (data: AuthEmailHookData) =>
        React.createElement(EmailChangeEmail, {
          siteName: SITE_NAME,
          oldEmail: data.old_email ?? "",
          email: data.email,
          newEmail: data.new_email ?? "",
          confirmationUrl: rewriteConfirmationUrl(data.url),
          locale: resolveLocale(data),
        }),
    },
    reauthentication: {
      subject: `Votre code de vérification — ${SITE_NAME}`,
      render: (data: AuthEmailHookData) =>
        React.createElement(ReauthenticationEmail, {
          token: data.token ?? "",
          locale: resolveLocale(data),
        }),
    },
  },
});

export const Route = createFileRoute("/lovable/email/auth/webhook")({
  server: {
    handlers: {
      POST: ({ request }) => handler(request),
    },
  },
});
