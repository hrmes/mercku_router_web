import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 auto upgrade', () => {
  test('renders the auto-upgrade shell and schedule controls when enabled', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/upgrade/auto');

    await expect(page.locator(byE2E('auto-upgrade-card'))).toBeVisible();
    await expect(page.locator(byE2E('auto-upgrade-switch'))).toBeVisible();

    const schedule = page.locator(byE2E('auto-upgrade-schedule'));
    const time = page.locator(byE2E('auto-upgrade-time'));
    const submit = page.locator(byE2E('auto-upgrade-submit'));

    if (await submit.count()) {
      await expect(schedule).toBeVisible();
      await expect(time).toBeVisible();
      await expect(submit).toBeVisible();
    }
  });
});
