import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 wifi content', () => {
  test('renders the key wifi configuration sections', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wifi');

    await expect(page.locator(byE2E('wifi-smart-connect-card'))).toBeVisible();
    await expect(page.locator(byE2E('wifi-compatibility-card'))).toBeVisible();
    await expect(page.locator(byE2E('wifi-24g-form'))).toBeVisible();
    await expect(page.locator(byE2E('wifi-channel-form'))).toBeVisible();
    await expect(page.locator(byE2E('wifi-channel-width-form'))).toBeVisible();
    await expect(page.locator(byE2E('wifi-tx-power-form'))).toBeVisible();
    await expect(page.locator(byE2E('wifi-submit'))).toBeVisible();
  });

  test('reveals the 5g form when smart connect is turned off', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wifi');

    const fiveGForm = page.locator(byE2E('wifi-5g-form'));
    await expect(fiveGForm).toHaveCount(0);

    await page.locator(byE2E('wifi-smart-connect-toggle')).locator('.mk-switch__inner').click();

    await expect(fiveGForm).toBeVisible();
  });
});
