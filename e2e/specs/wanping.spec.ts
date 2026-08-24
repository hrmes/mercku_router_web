import type { Page } from '@playwright/test';

import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

const expectWanPingMenuSelectedOnly = async (page: Page) => {
  await expect(page.locator(byE2E('aside-wanping'))).toHaveClass(/selected/);
  await expect(page.locator(byE2E('aside-wan'))).not.toHaveClass(/selected/);
};

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

  test('highlights only the wan ping menu item when opening the route directly', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wanping');

    await expectWanPingMenuSelectedOnly(page);
  });

  test('highlights only the wan ping menu item when navigating by aside menu', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wan');
    await page.locator(byE2E('aside-wanping')).click();

    await expect(page).toHaveURL(/\/web\/setting\/wanping$/);
    await expectWanPingMenuSelectedOnly(page);
  });
});
