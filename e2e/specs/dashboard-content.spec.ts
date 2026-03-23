import { expect, test } from '../fixtures/app';

import { byE2E } from '../helpers/selectors';
import { openAppRoute } from '../helpers/navigation';

test.describe('GA630 dashboard content', () => {
  test('renders the main dashboard cards and mesh action', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/dashboard');

    await expect(page.locator(byE2E('dashboard-device-card'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-internet-card'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-functional-panel'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-mesh-action'))).toBeVisible();
  });

  test('shows the expected device list sections on /dashboard/device/primary', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/dashboard/device/primary');

    await expect(page.locator(byE2E('dashboard-device-page'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-device-tab-primary'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-device-tab-offline'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-device-table-body'))).toBeVisible();

    const tableHead = page.locator(byE2E('dashboard-device-table-head'));
    if (await tableHead.count()) {
      await expect(tableHead).toBeVisible();
    }

    const rows = page.locator(byE2E('dashboard-device-list'));
    const empty = page.locator(byE2E('dashboard-device-empty'));
    const loading = page.locator(byE2E('dashboard-device-loading'));
    await expect(rows.or(empty).or(loading).first()).toBeVisible();
  });
  test('shows realtime and WAN detail sections on /dashboard/internet', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/dashboard/internet');

    const bridgeState = page.locator(byE2E('dashboard-internet-bridge'));
    if (await bridgeState.count()) {
      await expect(bridgeState).toBeVisible();
    } else {
      await expect(page.locator(byE2E('dashboard-internet-realtime'))).toBeVisible();
      await expect(page.locator(byE2E('dashboard-internet-traffic'))).toBeVisible();

      const speedtest = page.locator(byE2E('dashboard-internet-speedtest'));
      const speedtestDisabled = page.locator(byE2E('dashboard-internet-speedtest-disabled'));
      await expect(speedtest.or(speedtestDisabled).first()).toBeVisible();
    }

    await expect(page.locator(byE2E('dashboard-internet-ipv4'))).toBeVisible();

    const ipv6Section = page.locator(byE2E('dashboard-internet-ipv6'));
    if (await ipv6Section.count()) {
      await expect(ipv6Section).toBeVisible();
    }
  });
  test('shows topology and selected node details on /dashboard/mesh', async ({ page, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await openAppRoute(page, '/dashboard/mesh');

    await expect(page.locator(byE2E('dashboard-mesh-page'))).toBeVisible();
    const topo = page.locator(byE2E('dashboard-mesh-topology'));
    await expect(topo).toBeVisible();
    const hasRouters = await page.waitForFunction(() => {
      const vm = document.querySelector('[data-e2e="dashboard-mesh-page"]')?.__vue__;
      return Array.isArray(vm?.routers) ? vm.routers.length : null;
    }, { timeout: 5000 }).then(result => Boolean(result)).catch(() => false);
    test.skip(!hasRouters, 'No mesh nodes are available in this environment');

    await page.locator(byE2E('dashboard-mesh-page')).evaluate(el => {
      const vm = el.__vue__;
      if (!vm || !vm.routers?.length) {
        return;
      }

      const firstRouter = vm.routers[0];
      vm.selectedSN = firstRouter.sn;
      vm.selectedNodeInfo = {
        ...firstRouter,
        color: firstRouter.color
      };
      vm.showTable = true;
    });

    await expect(page.locator(byE2E('dashboard-mesh-detail-card'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-mesh-node-name'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-mesh-node-sn'))).toBeVisible();
    await expect(page.locator(byE2E('dashboard-mesh-devices'))).toBeVisible();
  });
});
