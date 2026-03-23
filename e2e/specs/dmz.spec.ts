import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 dmz', () => {
  test('renders the DMZ form and submit action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/dmz');

    await expect(page.locator(byE2E('dmz-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('dmz-ip-input'))).toBeVisible();
    await expect(page.locator(byE2E('dmz-submit'))).toBeVisible();
  });
});
