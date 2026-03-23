import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 wan content', () => {
  test('renders the core WAN configuration sections', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wan');

    await expect(page.locator(byE2E('wan-summary-card'))).toBeVisible();
    await expect(page.locator(byE2E('wan-net-type-card'))).toBeVisible();
    await expect(page.locator(byE2E('wan-vlan-card'))).toBeVisible();
    await expect(page.locator(byE2E('wan-submit'))).toBeVisible();
  });

  test('shows the correct form fields when switching WAN network type', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wan');

    const netTypeSelect = page.locator(byE2E('wan-net-type-select'));

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(1).click();

    await expect(page.locator(byE2E('wan-pppoe-form'))).toBeVisible();
    await expect(page.locator(byE2E('wan-dhcp-form'))).toHaveCount(0);
    await expect(page.locator(byE2E('wan-static-form'))).toHaveCount(0);

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(2).click();

    await expect(page.locator(byE2E('wan-static-form'))).toBeVisible();
    await expect(page.locator(byE2E('wan-pppoe-form'))).toHaveCount(0);
    await expect(page.locator(byE2E('wan-dhcp-form'))).toHaveCount(0);
  });

  test('reveals VLAN detail fields only when VLAN is enabled', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wan');

    const vlanDetails = page.locator(byE2E('wan-vlan-form'));
    const vlanToggle = page.locator(byE2E('wan-vlan-toggle')).locator('.mk-switch__inner');

    if (await vlanDetails.count()) {
      await expect(vlanDetails).toBeVisible();
      await vlanToggle.click();
      await expect(vlanDetails).toHaveCount(0);
      await vlanToggle.click();
      await expect(vlanDetails).toBeVisible();
    } else {
      await vlanToggle.click();
      await expect(vlanDetails).toBeVisible();
    }
  });

  test('renders auto/manual DNS sections according to the current network type', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/setting/wan');

    const netTypeSelect = page.locator(byE2E('wan-net-type-select'));

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(0).click();
    await expect(page.locator(byE2E('wan-dhcp-dns-select'))).toBeVisible();

    const dhcpDnsFields = page.locator(byE2E('wan-dhcp-dns-fields'));
    if (await dhcpDnsFields.count()) {
      await expect(dhcpDnsFields).toBeVisible();
    } else {
      const dhcpDnsSelect = page.locator(byE2E('wan-dhcp-dns-select'));
      await dhcpDnsSelect.locator('.select').click();
      await dhcpDnsSelect.locator('.select-popup__item').nth(1).click();
      await expect(dhcpDnsFields).toBeVisible();
    }

    await netTypeSelect.locator('.select').click();
    await netTypeSelect.locator('.select-popup__item').nth(2).click();

    await expect(page.locator(byE2E('wan-static-form'))).toBeVisible();
    await expect(page.locator(byE2E('wan-static-dns-primary'))).toBeVisible();
    await expect(page.locator(byE2E('wan-static-dns-secondary'))).toBeVisible();
    await expect(page.locator(byE2E('wan-dhcp-dns-select'))).toHaveCount(0);
  });
});
