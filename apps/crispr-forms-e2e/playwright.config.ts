import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';

const baseURL = process.env['BASE_URL'] ?? 'http://localhost:3200';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src/specs' }),
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npx nx serve documentation',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});
