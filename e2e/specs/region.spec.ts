import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 region', () => {
  test('renders the region selector and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/region');

    await expect(page.locator(byE2E('region-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('region-select'))).toBeVisible();
    await expect(page.locator(byE2E('region-submit'))).toBeVisible();
  });
});
