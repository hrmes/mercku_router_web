import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 telnet', () => {
  test('renders the telnet switch and form shell', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/telnet');

    await expect(page.locator(byE2E('telnet-card'))).toBeVisible();
    await expect(page.locator(byE2E('telnet-switch'))).toBeVisible();
  });
});
