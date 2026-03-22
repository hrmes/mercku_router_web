import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 dashboard content', () => {
  test('renders the main dashboard cards and mesh action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/dashboard');

    await expect(page.locator(byE2E('dashboard-device-card'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-internet-card'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-functional-panel'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-mesh-action'))).toBeVisible();
  });

  test.fixme('shows the expected device list sections on /dashboard/device/primary', async () => {});
  test.fixme('shows realtime and WAN detail sections on /dashboard/internet', async () => {});
  test.fixme('shows topology and selected node details on /dashboard/mesh', async () => {});
});
