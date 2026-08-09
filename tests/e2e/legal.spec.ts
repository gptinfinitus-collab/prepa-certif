import { expect, test } from "@playwright/test";

const pages = [
  { path: "/cgu", heading: "Conditions générales d'utilisation" },
  { path: "/confidentialite", heading: "Politique de confidentialité" },
  { path: "/cookies", heading: "Politique de cookies" },
  { path: "/mentions-legales", heading: "Mentions légales" },
];

test.describe("Pages légales", () => {
  for (const { path, heading } of pages) {
    test(`${path} est publique, titrée et référencée`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page).toHaveTitle(new RegExp("PREPA CERTIF"));
      expect(await page.locator("h1").count()).toBe(1);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href", new RegExp(`${path}$`));
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length).toBeGreaterThan(20);
    });
  }

  test("navigation croisée depuis le pied de page", async ({ page }) => {
    await page.goto("/cgu");
    await page.getByRole("contentinfo").getByRole("link", { name: "Politique de cookies" }).click();
    await expect(page).toHaveURL(/\/cookies$/);
  });

  test("les liens légaux sont accessibles depuis la page de connexion", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("link", { name: /conditions/i }).first().click();
    await expect(page).toHaveURL(/\/cgu$/);
  });
});
