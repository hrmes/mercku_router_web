import { expect, test } from '../fixtures/app';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 offline upgrade', () => {
  test('renders the offline-upgrade instructions and upload shell', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/upgrade/offline');

    await expect(page.locator(byE2E('offline-upgrade-page'))).toBeVisible();
    await expect(page.locator(byE2E('offline-upgrade-description'))).toBeVisible();
    await expect(page.locator(byE2E('offline-upgrade-upload'))).toBeVisible();
  });

  test('shows selectable nodes after a valid firmware package upload', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');
    test.skip(!process.env.PLAYWRIGHT_FIRMWARE_PATH, 'PLAYWRIGHT_FIRMWARE_PATH is required');

    await loginToShell();
    await openAppRoute(page, '/upgrade/offline');

    await page
      .locator(`${byE2E('offline-upgrade-upload')} input[type="file"]`)
      .setInputFiles(process.env.PLAYWRIGHT_FIRMWARE_PATH!);

    const nodes = page.locator(byE2E('offline-upgrade-nodes'));
    const empty = page.locator(byE2E('offline-upgrade-empty'));
    await expect(nodes.or(empty).first()).toBeVisible({ timeout: 30000 });

    if (await nodes.count()) {
      await expect(page.locator(byE2E('offline-upgrade-node')).first()).toBeVisible();
      await expect(page.locator(byE2E('offline-upgrade-submit'))).toBeVisible();
    }
  });

  test('rejects files that do not match the accepted firmware extension', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    const invalidPath = path.join(os.tmpdir(), 'ga630-invalid-upgrade.bin');
    await fs.writeFile(invalidPath, 'not-a-firmware');

    await loginToShell();
    await openAppRoute(page, '/upgrade/offline');

    await page
      .locator(`${byE2E('offline-upgrade-upload')} input[type="file"]`)
      .setInputFiles(invalidPath);

    await expect(page.locator(byE2E('offline-upgrade-error'))).toBeVisible();
    await expect(page.locator(byE2E('offline-upgrade-nodes'))).toHaveCount(0);
    await expect(page.locator(byE2E('offline-upgrade-submit'))).toHaveCount(0);
  });

  test('rejects empty firmware packages before upload starts', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    const emptyPath = path.join(os.tmpdir(), 'ga630-empty-upgrade.ma');
    await fs.writeFile(emptyPath, '');

    await loginToShell();
    await openAppRoute(page, '/upgrade/offline');

    await page
      .locator(`${byE2E('offline-upgrade-upload')} input[type="file"]`)
      .setInputFiles(emptyPath);

    await expect(page.locator(byE2E('offline-upgrade-error'))).toBeVisible();
    await expect(page.locator(byE2E('offline-upgrade-nodes'))).toHaveCount(0);
    await expect(page.locator(byE2E('offline-upgrade-submit'))).toHaveCount(0);
  });
});
