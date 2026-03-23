import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 blacklist', () => {
  test('renders the blacklist table and action buttons', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/blacklist');

    await expect(page.locator(byE2E('blacklist-table'))).toBeVisible();
    await expect(page.locator(byE2E('blacklist-remove'))).toBeVisible();
    await expect(page.locator(byE2E('blacklist-add'))).toBeVisible();
  });
});
