import { expect, test } from '../fixtures/app';
import { byE2E } from '../helpers/selectors';
import { waitForLoginReady } from '../helpers/wait';

test.describe('GA630 smoke', () => {
  test('shows login controls', async ({ page, projectConfig }) => {
    await page.goto('/login');
    await waitForLoginReady(page);

    expect(projectConfig.modelId).toBe('GA630');
    await expect(page.locator(byE2E('login-password'))).toBeVisible();
    await expect(page.locator(byE2E('login-submit'))).toBeVisible();
  });

  test('enters the main shell with a valid password', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await expect(page.locator(byE2E('app-shell'))).toBeVisible();
  });
});
