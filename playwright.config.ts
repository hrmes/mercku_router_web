import { defineConfig } from '@playwright/test';
import { ga630Project } from './e2e/projects/ga630';

export default defineConfig({
  testDir: './e2e/specs',
  timeout: 30_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  passWithNoTests: true,
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
      ...process.env,
      DEV_PROXY_HOST: process.env.DEV_PROXY_HOST || 'http://192.168.127.40:55555'
    }
  }
});
