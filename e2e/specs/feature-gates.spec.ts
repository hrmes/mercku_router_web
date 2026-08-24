import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 feature gates', () => {
  test('keeps expected setting entries visible and omits SFP-only entry', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wifi');

    await expect(page.locator(byE2E('aside-wifi'))).toBeVisible();
    await expect(page.locator(byE2E('aside-wan'))).toBeVisible();
    await expect(page.locator(byE2E('aside-sfp'))).toHaveCount(0);
  });
});
