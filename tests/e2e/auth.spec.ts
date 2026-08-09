import { expect, test } from "@playwright/test";

test.describe("Page de connexion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth");
  });

  test("affiche le titre, le logo et les fournisseurs côte à côte", async ({ page }) => {
    await expect(page).toHaveTitle(/PREPA CERTIF/i);
    const google = page.getByRole("button", { name: /google/i });
    const apple = page.getByRole("button", { name: /apple/i });
    await expect(google).toBeVisible();
    await expect(apple).toBeVisible();

    const g = await google.boundingBox();
    const a = await apple.boundingBox();
    expect(g).not.toBeNull();
    expect(a).not.toBeNull();
    // Même ligne : centres verticaux quasi identiques.
    expect(Math.abs(g!.y + g!.height / 2 - (a!.y + a!.height / 2))).toBeLessThan(8);
    expect(a!.x).toBeGreaterThan(g!.x);
  });

  test("bascule la visibilité du mot de passe", async ({ page }) => {
    const password = page.getByLabel("Mot de passe", { exact: true });
    await password.fill("secret123");
    await expect(password).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: /afficher le mot de passe/i }).first().click();
    await expect(password).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: /masquer le mot de passe/i }).first().click();
    await expect(password).toHaveAttribute("type", "password");
  });

  test("valide les champs avant tout appel réseau", async ({ page }) => {
    let authCalls = 0;
    await page.route("**/auth/v1/**", (route) => {
      authCalls += 1;
      return route.abort();
    });
    await page.getByLabel(/adresse e-mail|e-mail/i).first().fill("pas-un-email");
    await page.getByLabel("Mot de passe", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^se connecter$/i }).click();
    await expect(page.getByText(/adresse e-mail invalide/i)).toBeVisible();
    await expect(page.getByText(/au moins 6 caractères/i)).toBeVisible();
    expect(authCalls).toBe(0);
  });

  test("ouvre le formulaire de mot de passe oublié", async ({ page }) => {
    await page.getByRole("button", { name: /mot de passe oublié/i }).click();
    await expect(page.getByRole("button", { name: /envoyer le lien|réinitialisation/i })).toBeVisible();
  });

  test("permet de passer à l'onglet inscription", async ({ page }) => {
    await page.getByRole("tab", { name: /inscription|créer/i }).click();
    await expect(page.getByRole("button", { name: /créer mon compte|s'inscrire/i })).toBeVisible();
  });
});
