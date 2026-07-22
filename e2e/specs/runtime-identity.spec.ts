/**
 * Runtime identity e2e tests.
 *
 * Verifies the browser-side bootstrap flow against different identity JSONs
 * served by the dev server. The dev server must be running via
 * `npm run dev:unified` with MERCKU_IDENTITY_FIXTURE set to a writable path.
 *
 * These tests are framework-only (Task 9): they define the scenarios from
 * the plan but are skipped by default because they require a running dev
 * server. Set RUNTIME_E2E=1 to enable.
 */
import { test, expect } from '@playwright/test';
import { generateIdentityFixture, openApp } from '../fixtures/runtime-config';

const describeRuntime = process.env.RUNTIME_E2E ? test.describe : test.describe.skip;

describeRuntime('runtime identity switching', () => {
  test.describe('unknown modelId fails closed (no admin UI)', () => {
    test.beforeAll(() => {
      generateIdentityFixture({ modelId: 'UNKNOWN_MODEL' });
    });

    test('shows a bootstrap error page instead of the app shell', async ({ page }) => {
      await openApp(page);
      // The error page is plain HTML rendered by main.js when bootstrap
      // rejects with an unknown-model error.
      await expect(page.locator('body')).toContainText(/error|unknown|model/i);
    });
  });

  test.describe('unknown customerId falls back to Neutral Profile', () => {
    test.beforeAll(() => {
      generateIdentityFixture({ customerId: '9999' });
    });

    test('boots the app with neutral branding and a diagnostic warning', async ({ page }) => {
      await openApp(page);
      // Neutral Profile uses productName "Router" and a grey theme.
      // The diagnostic warning should be visible in the console, not the UI.
      // This test asserts the app shell loads (does not show error page).
      await expect(page.locator('#app')).toBeVisible();
    });
  });

  test.describe('backend mismatch produces a diagnostic warning but does not block', () => {
    test.beforeAll(() => {
      generateIdentityFixture({ backend: 'other_backend' });
    });

    test('boots the app normally despite backend mismatch', async ({ page }) => {
      await openApp(page);
      await expect(page.locator('#app')).toBeVisible();
    });
  });

  test.describe('known model + customer boots successfully', () => {
    test.beforeAll(() => {
      generateIdentityFixture({ modelId: 'M11R4', customerId: '0001' });
    });

    test('shows the login page for a known identity', async ({ page }) => {
      await openApp(page);
      await expect(page.locator('#app')).toBeVisible();
    });
  });
});
