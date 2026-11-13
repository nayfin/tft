import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';

// Port 3201 (the crispr-forms-e2e suite uses 3200) so both suites can run at the same time
const baseURL = process.env['BASE_URL'] ?? 'http://localhost:3201';

export default defineConfig({
  ...nxE2EPreset(__filename, {
    testDir: './src/specs',
    // Never serve the HTML report (it would block the job); CI uploads it as an artifact instead
    openHtmlReport: process.env['CI'] ? 'never' : undefined,
  }),
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      // Tall enough that every feature page fits without scrolling. The pointer then never leaves the
      // viewport during a drag, which interactjs does not like
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 1400 },
      },
    },
  ],
  webServer: {
    command: 'npx nx serve documentation --port=3201',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});
