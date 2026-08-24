import { expect, test } from '../fixtures/app';

import { openAppRoute } from '../helpers/navigation';
import { byE2E } from '../helpers/selectors';

test.describe('GA630 online upgrade content', () => {
  test('renders the online-upgrade shell with either nodes or status messaging', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/upgrade/online');

    await expect(page.locator(byE2E('online-upgrade-page'))).toBeVisible();

    const nodes = page.locator(byE2E('online-upgrade-nodes'));
    const success = page.locator(byE2E('online-upgrade-success'));
    const error = page.locator(byE2E('online-upgrade-error'));
    const loading = page.locator(byE2E('global-loading'));
    await expect(nodes.or(success).or(error).or(loading).first()).toBeVisible();
  });

  test('shows selectable upgradable nodes when new firmware is available', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/upgrade/online');

    const nodes = page.locator(byE2E('online-upgrade-node'));
    test.skip((await nodes.count()) === 0, 'No upgradable nodes are available in this environment');

    await expect(page.locator(byE2E('online-upgrade-nodes'))).toBeVisible();
    await expect(nodes.first()).toBeVisible();
    await expect(page.locator(byE2E('online-upgrade-submit'))).toBeVisible();
  });

  test('keeps the upgrade action hidden when no upgradable nodes are available', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/upgrade/online');

    const nodes = page.locator(byE2E('online-upgrade-node'));
    test.skip((await nodes.count()) > 0, 'Upgradable nodes are available in this environment');

    const success = page.locator(byE2E('online-upgrade-success'));
    const error = page.locator(byE2E('online-upgrade-error'));
    const loading = page.locator(byE2E('global-loading'));
    await expect(success.or(error).or(loading).first()).toBeVisible();
    test.skip(await loading.isVisible(), 'Online upgrade is still loading in this environment');

    await expect(page.locator(byE2E('online-upgrade-message'))).toBeVisible();
    await expect(page.locator(byE2E('online-upgrade-submit'))).toHaveCount(0);
  });

  test('opens the changelog modal for a node that provides changelog content', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/upgrade/online');

    const changelogLinks = page.locator(byE2E('online-upgrade-changelog'));
    test.skip((await changelogLinks.count()) === 0, 'No changelog links are available in this environment');

    await changelogLinks.first().click();
    await expect(page.locator(byE2E('online-upgrade-changelog-modal'))).toBeVisible();
    await expect(page.locator(byE2E('online-upgrade-changelog-body'))).toBeVisible();
  });
});
