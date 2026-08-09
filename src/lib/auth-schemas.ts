import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "L'adresse e-mail est requise")
  .max(255, "Adresse e-mail trop longue")
  .email("Adresse e-mail invalide");

export const passwordSchema = z
  .string()
  .min(6, "Le mot de passe doit contenir au moins 6 caractères")
  .max(72, "Le mot de passe ne peut pas dépasser 72 caractères");

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
    message: "Les mots de passe ne correspondent pas",
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

/** Messages Supabase traduits pour l'utilisateur final. */
export function authErrorMessage(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "E-mail ou mot de passe incorrect.",
    "Email not confirmed": "Votre adresse e-mail n'est pas encore confirmée.",
    "User already registered": "Un compte existe déjà avec cette adresse e-mail.",
  };
  return map[message] ?? message;
}
