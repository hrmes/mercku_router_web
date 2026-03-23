import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 mac', () => {
  test('renders the WAN MAC selection controls and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/mac');

    await expect(page.locator(byE2E('mac-card'))).toBeVisible();
    await expect(page.locator(byE2E('mac-default-option'))).toBeVisible();
    await expect(page.locator(byE2E('mac-custom-option'))).toBeVisible();
    await expect(page.locator(byE2E('mac-submit'))).toBeVisible();
  });
});
