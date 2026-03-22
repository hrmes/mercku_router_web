import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 wan content', () => {
  test('renders the core WAN configuration sections', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wan');

    await expect(page.locator(byE2E('wan-summary-card'))).toBeVisible();
    await expect(page.locator(byE2E('wan-net-type-card'))).toBeVisible();
    await expect(page.locator(byE2E('wan-vlan-card'))).toBeVisible();
    await expect(page.locator(byE2E('wan-submit'))).toBeVisible();
  });

  test.fixme('shows the correct form fields when switching WAN network type', async () => {});
  test.fixme('reveals VLAN detail fields only when VLAN is enabled', async () => {});
  test.fixme('renders auto/manual DNS sections according to the current network type', async () => {});
});
