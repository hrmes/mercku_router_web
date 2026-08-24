import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 upnp', () => {
  test('renders the UPNP switch card', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/upnp');

    await expect(page.locator(byE2E('upnp-card'))).toBeVisible();
    await expect(page.locator(byE2E('upnp-switch'))).toBeVisible();
  });
});
