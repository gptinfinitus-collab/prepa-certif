import { expect, test } from "@playwright/test";

test.describe("Espace d'administration", () => {
  test("/admin renvoie un visiteur non connecté vers la page de connexion", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/auth/);
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });

  test("les fonctions serveur d'administration refusent un appel non authentifié", async ({
    request,
  }) => {
    const response = await request.post("/_serverFn/src_lib_admin_functions_ts--deleteUserAccount", {
      data: { data: { userId: "00000000-0000-0000-0000-000000000000" } },
      failOnStatusCode: false,
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });
});
