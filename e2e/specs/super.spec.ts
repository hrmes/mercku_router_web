import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 super', () => {
  test('renders the super admin password form', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/super');

    await expect(page.locator(byE2E('super-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('super-password-input'))).toBeVisible();
    await expect(page.locator(byE2E('super-submit'))).toBeVisible();
  });
});
