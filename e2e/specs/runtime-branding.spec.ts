/**
 * Runtime branding e2e tests.
 *
 * Verifies that switching customerId in the identity JSON changes the
 * branding (logo, favicon, theme color, product name) without rebuilding.
 * The dev server must be running via `npm run dev:unified`.
 *
 * Framework-only (Task 9): skipped by default. Set RUNTIME_E2E=1 to enable.
 */
import { test, expect } from '@playwright/test';
import { generateIdentityFixture, openApp } from '../fixtures/runtime-config';

const describeRuntime = process.env.RUNTIME_E2E ? test.describe : test.describe.skip;

describeRuntime('runtime branding switching', () => {
  test.describe('customer 0001 (Mercku) branding', () => {
    test.beforeAll(() => {
      generateIdentityFixture({ customerId: '0001' });
    });

    test('applies Mercku brand color (#d6001c) to the loading indicator', async ({ page }) => {
      await openApp(page);
      // The brand-loading CSS variable should be set to #d6001c by
      // apply-branding.js at runtime.
      const color = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--brand-loading')
          .trim()
      );
      expect(color.toLowerCase()).toBe('#d6001c');
    });
  });

  test.describe('customer 0029 (JUNET) branding', () => {
    test.beforeAll(() => {
      generateIdentityFixture({ customerId: '0029' });
    });

    test('applies JUNET brand color (#00b4e4) to the loading indicator', async ({ page }) => {
      await openApp(page);
      const color = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--brand-loading')
          .trim()
      );
      expect(color.toLowerCase()).toBe('#00b4e4');
    });
  });

  test.describe('unknown customer falls back to neutral branding', () => {
    test.beforeAll(() => {
      generateIdentityFixture({ customerId: '9999' });
    });

    test('applies neutral brand color (#333333)', async ({ page }) => {
      await openApp(page);
      const color = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--brand-loading')
          .trim()
      );
      expect(color.toLowerCase()).toBe('#333333');
    });
  });
});
