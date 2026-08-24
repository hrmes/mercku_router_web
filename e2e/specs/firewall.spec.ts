import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 firewall', () => {
  test('renders the firewall controls and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/firewall');

    await expect(page.locator(byE2E('firewall-wan-dos-card'))).toBeVisible();
    await expect(page.locator(byE2E('firewall-ping-card'))).toBeVisible();
    await expect(page.locator(byE2E('firewall-submit'))).toBeVisible();
  });
});
