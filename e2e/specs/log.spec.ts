import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 advance log', () => {
  test('renders the syslog settings controls', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/log');

    await expect(page.locator(byE2E('log-form'))).toBeVisible();
    await expect(page.locator(byE2E('log-level-select'))).toBeVisible();
    await expect(page.locator(byE2E('log-capacity-input'))).toBeVisible();
    await expect(page.locator(byE2E('log-submit'))).toBeVisible();
  });
});
