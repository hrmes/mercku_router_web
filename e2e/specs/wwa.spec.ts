import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 wwa', () => {
  test('renders the web admin access form and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/wwa');

    await expect(page.locator(byE2E('wwa-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('wwa-port-input'))).toBeVisible();
    await expect(page.locator(byE2E('wwa-allowed-ip-input'))).toBeVisible();
    await expect(page.locator(byE2E('wwa-submit'))).toBeVisible();
  });
});
