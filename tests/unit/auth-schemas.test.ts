import { describe, expect, it } from "vitest";
import {
  authErrorKey,
  credentialsSchema,
  emailSchema,
  fieldErrors,
  forgotPasswordSchema,
  newPasswordSchema,
  passwordSchema,
  safePath,
} from "@/lib/auth-schemas";

describe("emailSchema", () => {
  it("accepte une adresse valide et la nettoie", () => {
    expect(emailSchema.parse("  user@example.com ")).toBe("user@example.com");
  });

  it("rejette une adresse vide ou invalide", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
    expect(emailSchema.safeParse("pas-un-email").success).toBe(false);
  });

  it("rejette une adresse trop longue", () => {
    expect(emailSchema.safeParse(`${"a".repeat(250)}@example.com`).success).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("exige au moins 6 caractères", () => {
    expect(passwordSchema.safeParse("12345").success).toBe(false);
    expect(passwordSchema.safeParse("123456").success).toBe(true);
  });

  it("refuse plus de 72 caractères", () => {
    expect(passwordSchema.safeParse("a".repeat(73)).success).toBe(false);
  });
});

describe("credentialsSchema / forgotPasswordSchema", () => {
  it("valide un couple e-mail + mot de passe", () => {
    const result = credentialsSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("remonte les deux erreurs de champ", () => {
    const result = credentialsSchema.safeParse({ email: "x", password: "1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors["email"]).toBeTruthy();
      expect(errors["password"]).toBeTruthy();
    }
  });

  it("ne demande que l'e-mail pour le mot de passe oublié", () => {
    expect(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
  });
});

describe("newPasswordSchema", () => {
  it("valide deux mots de passe identiques", () => {
    expect(newPasswordSchema.safeParse({ password: "secret123", confirm: "secret123" }).success).toBe(
      true,
    );
  });

  it("signale la non-correspondance sur le champ confirm", () => {
    const result = newPasswordSchema.safeParse({ password: "secret123", confirm: "autre123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error)["confirm"]).toBe("validation.passwordsMismatch");
    }
  });
});

describe("safePath", () => {
  it("retombe sur /dashboard pour les valeurs absentes ou externes", () => {
    expect(safePath(undefined)).toBe("/dashboard");
    expect(safePath("")).toBe("/dashboard");
    expect(safePath("https://evil.test")).toBe("/dashboard");
    expect(safePath("//evil.test")).toBe("/dashboard");
  });

  it("conserve un chemin interne", () => {
    expect(safePath("/planning")).toBe("/planning");
  });
});

describe("authErrorKey", () => {
  it("mappe les erreurs connues sur une clé de traduction", () => {
    expect(authErrorKey("Invalid login credentials")).toBe("errors.invalidCredentials");
    expect(authErrorKey("User already registered")).toBe("errors.alreadyRegistered");
  });

  it("renvoie null pour les messages inconnus", () => {
    expect(authErrorKey("Boom")).toBeNull();
  });
});
