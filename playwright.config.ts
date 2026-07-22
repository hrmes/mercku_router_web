import { defineConfig, type Project } from '@playwright/test';
import { ga630Project } from './e2e/projects/ga630';

// GA630 project requires a real router via DEV_PROXY_HOST.
// Unified runtime-identity project only needs the dev server (no router).
const enableGa630 = !!process.env.DEV_PROXY_HOST;
const enableRuntime = !!process.env.RUNTIME_E2E;

if (!enableGa630 && !enableRuntime) {
  throw new Error(
    'Either DEV_PROXY_HOST (for GA630 device tests) or RUNTIME_E2E=1 (for unified runtime-identity tests) must be set.'
  );
}

const projects: Project[] = [];
if (enableGa630) {
  projects.push({ name: ga630Project.name, metadata: ga630Project });
}
if (enableRuntime) {
  projects.push({ name: 'runtime-identity' });
}

// Use the unified dev server when running runtime-identity tests; otherwise
// use the legacy GA630 make dev command.
const useUnifiedServer = enableRuntime && !enableGa630;

// process.env values are `string | undefined`; Playwright's env field requires
// `Record<string, string>`. Strip undefined entries so the spread is clean.
const envVars: Record<string, string> = {};
for (const [k, v] of Object.entries(process.env)) {
  if (v !== undefined) envVars[k] = v;
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
  projects,
  webServer: useUnifiedServer
    ? {
        command: 'VUE_CLI_SERVICE_CONFIG_PATH=$PWD/unified/vue.config.js NODE_OPTIONS=--openssl-legacy-provider vue-cli-service serve',
        url: 'http://127.0.0.1:8080',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
          ...envVars,
          MERCKU_IDENTITY_FIXTURE: process.env.MERCKU_IDENTITY_FIXTURE || '/tmp/runtime-config-e2e.v1.json',
        },
      }
    : {
        command: 'make dev CUSTOMER_ID=0001 MODEL_ID=GA630',
        url: 'http://127.0.0.1:8080',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe',
        env: envVars
      }
});
