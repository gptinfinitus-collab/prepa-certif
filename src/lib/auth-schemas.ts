import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "validation.emailRequired")
  .max(255, "validation.emailTooLong")
  .email("validation.emailInvalid");

export const passwordSchema = z
  .string()
  .min(6, "validation.passwordTooShort")
  .max(72, "validation.passwordTooLong");

export const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "validation.passwordsMismatch",
  });

/** Convertit une erreur Zod en dictionnaire champ -> message. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** N'autorise que des chemins internes ; tout le reste retombe sur /dashboard. */
export function safePath(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

/**
 * Convertit un message Supabase en clé de traduction du namespace `auth`.
 * Renvoie `null` quand le message n'est pas reconnu : l'appelant affiche alors
 * un message générique.
 */
export function authErrorKey(message: string): string | null {
  const map: Record<string, string> = {
    "Invalid login credentials": "errors.invalidCredentials",
    "Email not confirmed": "errors.emailNotConfirmed",
    "User already registered": "errors.alreadyRegistered",
  };
  return map[message] ?? null;
}
