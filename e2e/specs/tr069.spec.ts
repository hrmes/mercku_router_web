import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 tr069', () => {
  test('renders the remote and local TR069 settings forms', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/tr069');

    await expect(page.locator(byE2E('tr069-remote-card'))).toBeVisible();
    await expect(page.locator(byE2E('tr069-local-card'))).toBeVisible();
    await expect(page.locator(byE2E('tr069-remote-url-input'))).toBeVisible();
    await expect(page.locator(byE2E('tr069-local-port-input'))).toBeVisible();
    await expect(page.locator(byE2E('tr069-submit'))).toBeVisible();
  });
});
