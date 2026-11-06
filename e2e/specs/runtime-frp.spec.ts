import { test, expect, type Page } from '@playwright/test';

const initialConfig = {
  enabled: false, server_addr: 'frps.example.com', server_port: 7000, token: '', sk: '',
  proxies: [
    { name: 'office_web', local_ip: '127.0.0.1', local_port: 80 },
    { name: 'office_ssh', local_ip: '192.168.1.30', local_port: 22 }
  ]
};
const rows = (page: Page) => page.locator('[data-e2e="frp-proxy-row"]');
const field = (page: Page, index: number, name: string) =>
  rows(page).nth(index).locator(`[data-e2e="frp-proxy-${name}-input"]`);

async function save(page: Page) {
  await Promise.all([
    page.waitForResponse(response => response.url().endsWith('/app') &&
      response.request().postDataJSON()?.method === 'router.frp.update'),
    page.locator('[data-e2e="frp-submit"]').click()
  ]);
  await expect(page.locator('[data-e2e="frp-submit"]')).toBeEnabled();
}

async function readConfig(page: Page) {
  const response = await page.request.post('/app', { data: { method: 'router.frp.get' } });
  return (await response.json()).result;
}

async function addNas(page: Page) {
  await page.locator('[data-e2e="frp-proxy-add"]').click();
  const index = await rows(page).count() - 1;
  await field(page, index, 'name').fill('nas');
  await field(page, index, 'ip').fill('192.168.1.50');
  await field(page, index, 'port').fill('5000');
}

test.describe('FRP editable STCP proxy list', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('lang', 'zh-CN');
      // Test the HTTP clipboard fallback without changing the user's clipboard.
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
      document.execCommand = command => {
        if (command !== 'copy') return false;
        (window as Window & { frpCopied?: string }).frpCopied =
          (document.activeElement as HTMLTextAreaElement).value;
        return true;
      };
    });
    await page.goto('/');
    await page.locator('input[type="password"]').fill('preview');
    await page.locator('.login-form button').click();
    await expect(page).toHaveURL(/\/web\/dashboard$/);
    await page.request.post('/app', { data: { method: 'router.frp.update', params: initialConfig } });
    await page.goto('/web/advance/frp');
    await expect(page.locator('[data-e2e="frp-submit"]')).toBeEnabled();
    await expect(rows(page)).toHaveCount(2);
  });

  test('adds a LAN service, saves the complete list and copies its visitor target name', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await addNas(page);
    expect((await readConfig(page)).proxies).toHaveLength(2);
    await page.locator('[data-e2e="frp-sk-input"]').fill('customer-shared-secret');
    await page.locator('[data-e2e="frp-switch"] .mk-switch__inner').click();
    await expect(page.locator('[data-e2e="frp-submit"]')).toBeEnabled();
    await page.reload();
    await expect(rows(page)).toHaveCount(3);
    await expect(field(page, 2, 'name')).toHaveValue('nas');
    await expect(field(page, 2, 'ip')).toHaveValue('192.168.1.50');
    await expect(field(page, 2, 'port')).toHaveValue('5000');
    await rows(page).nth(2).locator('[data-e2e="frp-proxy-name-copy"]').click();
    expect(await page.evaluate(() => (window as Window & { frpCopied?: string }).frpCopied))
      .toBe('nas');
    await field(page, 2, 'name').fill('office_nas');
    await expect(page.locator('[data-e2e="frp-name-warning"]')).toBeVisible();
    await save(page);
    await page.reload();
    await expect(field(page, 2, 'name')).toHaveValue('office_nas');
    await expect(page.locator('[data-e2e="frp-name-warning"]')).toHaveCount(0);
    const config = await readConfig(page);
    expect(config.proxies[2]).toEqual({
      name: 'office_nas', local_ip: '192.168.1.50', local_port: 5000
    });
    expect(config.sk).toBe('customer-shared-secret');
    await expect(page.locator('[data-e2e="global-loading"]')).not.toBeVisible();
    const card = await page.locator('[data-e2e="frp-form-card"]').boundingBox();
    expect(card!.width).toBeGreaterThan(1000);
    expect(card!.height).toBeLessThan(950);
    const name = await field(page, 0, 'name').boundingBox();
    const ip = await field(page, 0, 'ip').boundingBox();
    const port = await field(page, 0, 'port').boundingBox();
    expect(Math.abs(name!.y - ip!.y)).toBeLessThan(2);
    expect(Math.abs(name!.y - port!.y)).toBeLessThan(2);
    const server = await page.locator('[data-e2e="frp-server-addr-input"]').boundingBox();
    const secret = await page.locator('[data-e2e="frp-sk-input"]').boundingBox();
    expect(secret!.x).toBeGreaterThan(server!.x + server!.width);
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.screenshot({ path: 'test-results/frp-desktop.png', fullPage: true, animations: 'disabled' });
    expect(errors).toEqual([]);
  });

  test('validates blank fields, duplicate names and IP/port ranges on added rows', async ({ page }) => {
    await page.locator('[data-e2e="frp-proxy-add"]').click();
    await page.locator('[data-e2e="frp-submit"]').click();
    await expect(rows(page).nth(2).locator('.form-item-error')).toHaveCount(2);
    expect((await readConfig(page)).proxies).toHaveLength(2);
    await field(page, 2, 'name').fill('office_web');
    await field(page, 2, 'ip').fill('300.1.2.3');
    await field(page, 2, 'port').fill('65536');
    await page.locator('[data-e2e="frp-submit"]').click();
    await expect(page.locator('.form-item-error')).toHaveCount(4);
    await field(page, 2, 'name').fill('nas');
    await field(page, 2, 'ip').fill('192.168.1.50');
    await field(page, 2, 'port').fill('5000');
    await save(page);
    expect((await readConfig(page)).proxies).toHaveLength(3);
  });

  test('removes the middle row without mixing up values and persists deletions', async ({ page }) => {
    await addNas(page);
    await save(page);
    await rows(page).nth(1).locator('[data-e2e="frp-proxy-remove"]').click();
    await expect(rows(page)).toHaveCount(2);
    await expect(field(page, 1, 'name')).toHaveValue('nas');
    await expect(field(page, 1, 'port')).toHaveValue('5000');
    await save(page);
    await page.reload();
    await expect(rows(page)).toHaveCount(2);
    await expect(field(page, 1, 'name')).toHaveValue('nas');
    await page.locator('[data-e2e="frp-proxy-add"]').click();
    await expect(field(page, 2, 'name')).toHaveValue('');
    await expect(field(page, 2, 'port')).toHaveValue('');
    await rows(page).nth(2).locator('[data-e2e="frp-proxy-remove"]').click();
    await save(page);
  });

  test('keeps empty lists empty, prevents empty enabling and lets users stop with invalid drafts', async ({ page }) => {
    await page.locator('[data-e2e="frp-switch"] .mk-switch__inner').click();
    await expect(page.locator('[data-e2e="frp-submit"]')).toBeEnabled();
    await rows(page).nth(0).locator('[data-e2e="frp-proxy-remove"]').click();
    await rows(page).nth(0).locator('[data-e2e="frp-proxy-remove"]').click();
    await page.locator('[data-e2e="frp-submit"]').click();
    await expect(page.locator('.form-item-error')).toHaveCount(1);
    expect((await readConfig(page)).enabled).toBe(true);
    await page.locator('[data-e2e="frp-switch"] .mk-switch__inner').click();
    await expect(rows(page)).toHaveCount(2);
    await expect(page.locator('[data-e2e="frp-sk-input"]')).toHaveValue('');
    await rows(page).nth(0).locator('[data-e2e="frp-proxy-remove"]').click();
    await rows(page).nth(0).locator('[data-e2e="frp-proxy-remove"]').click();
    await save(page);
    await page.reload();
    await expect(rows(page)).toHaveCount(0);
    expect((await readConfig(page)).proxies).toEqual([]);
    await page.locator('[data-e2e="frp-switch"] .mk-switch__inner').click();
    await expect(page.locator('.form-item-error')).toHaveCount(1);
    expect((await readConfig(page)).enabled).toBe(false);
    await page.locator('[data-e2e="frp-proxy-add"]').click();
    await expect(rows(page)).toHaveCount(1);
  });

  test('migrates legacy Web and SSH settings and saves them as a list', async ({ page }) => {
    const legacy = {
      ...initialConfig, proxies: undefined, web_name: 'legacy_web', web_ip: '192.168.2.10',
      web_port: 8080, ssh_name: 'legacy_ssh', ssh_ip: '192.168.2.20', ssh_port: 2222
    };
    await page.route('**/app', route => {
      if (route.request().postDataJSON()?.method === 'router.frp.get') {
        return route.fulfill({ json: { result: legacy } });
      }
      return route.continue();
    });
    await page.reload();
    await expect(field(page, 0, 'name')).toHaveValue('legacy_web');
    await expect(field(page, 0, 'ip')).toHaveValue('192.168.2.10');
    await expect(field(page, 1, 'port')).toHaveValue('2222');
    await page.unroute('**/app');
    await save(page);
    await page.reload();
    await expect(field(page, 1, 'name')).toHaveValue('legacy_ssh');
    expect((await readConfig(page)).proxies[0].local_port).toBe(8080);
  });

  test('keeps all proxy controls usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await addNas(page);
    const name = await field(page, 2, 'name').boundingBox();
    const copy = await rows(page).nth(2).locator('[data-e2e="frp-proxy-name-copy"]').boundingBox();
    expect(name!.width).toBeGreaterThan(210);
    expect(copy!.x + copy!.width).toBeLessThanOrEqual(390);
    const ip = await field(page, 2, 'ip').boundingBox();
    const port = await field(page, 2, 'port').boundingBox();
    expect(port!.y).toBeGreaterThan(ip!.y);
    await save(page);
    await page.reload();
    await expect(rows(page)).toHaveCount(3);
    await page.setViewportSize({ width: 390, height: 2400 });
    await expect(page.locator('[data-e2e="global-loading"]')).not.toBeVisible();
    await page.screenshot({ path: 'test-results/frp-mobile.png', fullPage: true, animations: 'disabled' });
    await page.setViewportSize({ width: 1024, height: 1000 });
    await page.reload();
    await expect(rows(page)).toHaveCount(3);
    for (const name of ['name', 'ip', 'port']) {
      const bounds = await field(page, 2, name).boundingBox();
      expect(bounds!.width).toBeGreaterThan(90);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(1024);
    }
  });
});
