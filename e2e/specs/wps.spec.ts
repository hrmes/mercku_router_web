import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 wps', () => {
  test('renders the WPS intro, selector, and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wps');

    await expect(page.locator(byE2E('wps-intro-card'))).toBeVisible();
    await expect(page.locator(byE2E('wps-form'))).toBeVisible();
    await expect(page.locator(byE2E('wps-band-select'))).toBeVisible();
    await expect(page.locator(byE2E('wps-submit'))).toBeVisible();
  });
});
