import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Certains environnements CI fournissent déjà un Chromium ; on le réutilise si présent.
const localChromium =
  "/opt/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell";
const executablePath = existsSync(localChromium) ? localChromium : undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: process.env["E2E_BASE_URL"] ?? "http://localhost:8080",
    viewport: { width: 1280, height: 900 },
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
    },
  ],
});
