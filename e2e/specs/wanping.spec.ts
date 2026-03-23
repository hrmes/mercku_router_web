import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 wan ping', () => {
  test('renders the wan ping form and start action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wanping');

    await expect(page.locator(byE2E('wanping-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('wanping-form'))).toBeVisible();
    await expect(page.locator(byE2E('wanping-host-input'))).toBeVisible();
    await expect(page.locator(byE2E('wanping-start'))).toBeVisible();
  });
});
