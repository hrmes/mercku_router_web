import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 network mode', () => {
  test('renders the mode selector and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/mode');

    await expect(page.locator(byE2E('mode-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('mode-options'))).toBeVisible();
    await expect(page.locator(byE2E('mode-submit'))).toHaveCount(1);
  });
});
