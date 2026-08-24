import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 diagnosis', () => {
  test('renders the network diagnosis form and start action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/diagnosis');

    await expect(page.locator(byE2E('diagnosis-form-card'))).toBeVisible();
    await expect(page.locator(byE2E('diagnosis-form'))).toBeVisible();
    await expect(page.locator(byE2E('diagnosis-host-input'))).toBeVisible();
    await expect(page.locator(byE2E('diagnosis-start'))).toBeVisible();
  });
});
