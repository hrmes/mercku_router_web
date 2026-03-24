import { defineConfig } from '@playwright/test';
import { ga630Project } from './e2e/projects/ga630';

if (!process.env.DEV_PROXY_HOST) {
  throw new Error(
    'DEV_PROXY_HOST is required for GA630 Playwright runs. Enable WAN Access on the router and set DEV_PROXY_HOST=http://<router-address>:<port>.'
  );
}

export default defineConfig({
  testDir: './e2e/specs',
  timeout: 30_000,
  workers: Number(process.env.PLAYWRIGHT_WORKERS || 1),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8080',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: ga630Project.name,
      metadata: ga630Project
    }
  ],
  webServer: {
    command: 'make dev CUSTOMER_ID=0001 MODEL_ID=GA630',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      ...process.env
    }
  }
});
