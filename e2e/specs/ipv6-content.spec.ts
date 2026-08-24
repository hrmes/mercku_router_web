import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

const ensureIpv6ConfigVisible = async (page: Parameters<typeof test>[0]['page']) => {
  const configCard = page.locator(byE2E('ipv6-config-card'));

  if (await configCard.count()) {
    return configCard;
  }

  await page.locator(byE2E('ipv6-enabled-switch')).locator('.mk-switch__inner').click();
  await expect(configCard).toBeVisible();

  return configCard;
};

test.describe('GA630 ipv6 content', () => {
  test('renders the ipv6 shell and basic controls', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/ipv6');

    await expect(page.locator(byE2E('ipv6-toggle-card'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-enabled-switch'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-submit'))).toBeVisible();

    const configCard = page.locator(byE2E('ipv6-config-card'));
    if (await configCard.isVisible().catch(() => false)) {
      await expect(page.locator(byE2E('ipv6-network-type-select'))).toBeVisible();
    }
  });

  test('shows the correct editable fields for each ipv6 network type', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/ipv6');
    await ensureIpv6ConfigVisible(page);

    const netTypeSelect = page.locator(byE2E('ipv6-network-type-select'));

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(0).click();
    await expect(page.locator(byE2E('ipv6-auto-form'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-pppoe-form'))).toHaveCount(0);
    await expect(page.locator(byE2E('ipv6-static-form'))).toHaveCount(0);

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(1).click();
    await expect(page.locator(byE2E('ipv6-pppoe-form'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-pppoe-account'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-pppoe-password'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-auto-form'))).toHaveCount(0);
    await expect(page.locator(byE2E('ipv6-static-form'))).toHaveCount(0);

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(2).click();
    await expect(page.locator(byE2E('ipv6-static-form'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-static-ip-input'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-static-prefix-input'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-static-gateway-input'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-static-dns-input'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-auto-form'))).toHaveCount(0);
    await expect(page.locator(byE2E('ipv6-pppoe-form'))).toHaveCount(0);
  });

  test('reveals manual dns input when auto dns is disabled', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/ipv6');
    await ensureIpv6ConfigVisible(page);

    const netTypeSelect = page.locator(byE2E('ipv6-network-type-select'));

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(0).click();
    await expect(page.locator(byE2E('ipv6-auto-dns-select'))).toBeVisible();

    const autoDnsFields = page.locator(byE2E('ipv6-auto-dns-fields'));
    if (await autoDnsFields.count()) {
      await expect(autoDnsFields).toBeVisible();
    } else {
      const autoDnsSelect = page.locator(byE2E('ipv6-auto-dns-select'));
      await autoDnsSelect.locator('.select').click();
      await autoDnsSelect.locator('.select-popup__item').nth(1).click();
      await expect(autoDnsFields).toBeVisible();
    }

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(1).click();
    await expect(page.locator(byE2E('ipv6-pppoe-dns-select'))).toBeVisible();

    const pppoeDnsFields = page.locator(byE2E('ipv6-pppoe-dns-fields'));
    if (await pppoeDnsFields.count()) {
      await expect(pppoeDnsFields).toBeVisible();
    } else {
      const pppoeDnsSelect = page.locator(byE2E('ipv6-pppoe-dns-select'));
      await pppoeDnsSelect.locator('.select').click();
      await pppoeDnsSelect.locator('.select-popup__item').nth(1).click();
      await expect(pppoeDnsFields).toBeVisible();
    }

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(2).click();
    await expect(page.locator(byE2E('ipv6-static-form'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-static-dns-input'))).toBeVisible();
    await expect(page.locator(byE2E('ipv6-auto-dns-select'))).toHaveCount(0);
    await expect(page.locator(byE2E('ipv6-pppoe-dns-select'))).toHaveCount(0);
  });
});
