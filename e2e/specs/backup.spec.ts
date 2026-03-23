import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 backup', () => {
  test('renders the backup and restore controls', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/advance/backup');

    await expect(page.locator(byE2E('backup-download-card'))).toBeVisible();
    await expect(page.locator(byE2E('backup-download-button'))).toBeVisible();
    await expect(page.locator(byE2E('backup-restore-card'))).toBeVisible();
    await expect(page.locator(byE2E('backup-restore-submit'))).toBeVisible();
  });
});
