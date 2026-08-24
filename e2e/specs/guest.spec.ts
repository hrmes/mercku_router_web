import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 guest network', () => {
  test('renders the guest controls and reveals the 5g section when smart connect is disabled', async ({
    page,
    loginToShell
  }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/guest');

    await expect(page.locator(byE2E('guest-toggle-card'))).toBeVisible();
    await expect(page.locator(byE2E('guest-enabled-switch'))).toBeVisible();

    const statusSection = page.locator(byE2E('guest-status-section'));
    if (await statusSection.isVisible().catch(() => false)) {
      await page.locator(byE2E('guest-edit')).click();
    }

    const settingsSection = page.locator(byE2E('guest-settings-section'));
    if (!(await settingsSection.isVisible().catch(() => false))) {
      await page.locator(`${byE2E('guest-enabled-switch')} .mk-switch__inner`).click();
    }

    await expect(settingsSection).toBeVisible();
    await expect(page.locator(byE2E('guest-duration-select'))).toBeVisible();
    await expect(page.locator(byE2E('guest-smart-connect-switch'))).toBeVisible();
    await expect(page.locator(byE2E('guest-24g-card'))).toBeVisible();

    const guest5gCard = page.locator(byE2E('guest-5g-card'));
    await expect(guest5gCard).toBeHidden();

    await page.locator(`${byE2E('guest-smart-connect-switch')} .mk-switch__inner`).click();
    await expect(guest5gCard).toBeVisible();

    await expect(page.locator(byE2E('guest-submit'))).toBeVisible();
  });
});
