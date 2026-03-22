import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 timezone', () => {
  test('renders the timezone selector and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/timezone');

    await expect(page.locator(byE2E('timezone-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('timezone-select'))).toBeVisible();
    await expect(page.locator(byE2E('timezone-submit'))).toBeVisible();
  });
});
