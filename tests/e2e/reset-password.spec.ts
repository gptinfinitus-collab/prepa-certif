import { expect, test } from "@playwright/test";

test.describe("Réinitialisation du mot de passe", () => {
  test("affiche un message d'expiration sans session valide", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.getByText(/invalide ou a expiré/i)).toBeVisible();
    await page.getByRole("link", { name: /retour à la connexion/i }).click();
    await expect(page).toHaveURL(/\/auth/);
  });
});
