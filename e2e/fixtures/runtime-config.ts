/**
 * Playwright fixture for runtime-identity e2e tests.
 *
 * The unified dev server serves `/runtime-config.v1.json` from a fixture file
 * selected by the `MERCKU_IDENTITY_FIXTURE` env var (see
 * unified/dev/runtime-config-middleware.js). This fixture generates identity
 * JSON on the fly via scripts/mock-suite-generate.mjs and points the dev
 * server at it by writing to a temp file.
 *
 * Unlike the ga630 project, these tests do NOT need a real router - they
 * verify the browser-side identity -> profile -> menu/router/branding flow.
 * The dev server must already be running (`npm run dev:unified` with the
 * desired MERCKU_IDENTITY_FIXTURE).
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { test as base, expect } from '@playwright/test';

const REPO_ROOT = path.resolve(__dirname, '..', '..');

export type IdentityOptions = {
  modelId?: string;
  customerId?: string;
  backend?: string;
  caps?: string;
};

/**
 * Generate an identity fixture file via the mock suite generator and return
 * its path. The file is written to /tmp so the dev server middleware can
 * read it when MERCKU_IDENTITY_FIXTURE points at the same path.
 *
 * NOTE: Changing MERCKU_IDENTITY_FIXTURE requires restarting the dev server.
 * In practice, run the dev server with a fixed fixture path and regenerate
 * the file contents between test groups. The middleware re-reads on every
 * request, so a regenerated file takes effect on the next page reload
 * without restarting the dev server.
 */
export function generateIdentityFixture(opts: IdentityOptions = {}): string {
  const fixturePath = process.env.MERCKU_IDENTITY_FIXTURE
    || '/tmp/runtime-config-e2e.v1.json';
  const args = [
    'node', 'scripts/mock-suite-generate.mjs', fixturePath,
  ];
  if (opts.modelId) args.push('--model', opts.modelId);
  if (opts.customerId) args.push('--customer', opts.customerId);
  if (opts.backend) args.push('--backend', opts.backend);
  if (opts.caps) args.push('--caps', opts.caps);

  execSync(args.join(' '), { cwd: REPO_ROOT, stdio: 'pipe' });
  return fixturePath;
}

/**
 * Navigate to the app root and wait for the bootstrap to settle.
 * If bootstrap fails, the page shows a plain-HTML error page (no Vue).
 */
export async function openApp(page: import('@playwright/test').Page) {
  await page.goto('/');
  // Wait for either the app shell or the bootstrap error page.
  await page.waitForLoadState('networkidle');
}

export { base, expect };
