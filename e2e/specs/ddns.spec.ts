import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 ddns', () => {
  test('renders the DDNS service form and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/ddns');

    await expect(page.locator(byE2E('ddns-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('ddns-service-group'))).toBeVisible();
    await expect(page.locator(byE2E('ddns-domain-input'))).toBeVisible();
    await expect(page.locator(byE2E('ddns-username-input'))).toBeVisible();
    await expect(page.locator(byE2E('ddns-password-input'))).toBeVisible();
    await expect(page.locator(byE2E('ddns-submit'))).toBeVisible();
  });
});
