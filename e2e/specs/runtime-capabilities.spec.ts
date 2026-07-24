import { test, expect } from '@playwright/test';
import { generateIdentityFixture, openApp } from '../fixtures/runtime-config';

async function login(page: import('@playwright/test').Page) {
  await openApp(page);
  await page.locator('input[type="password"]').fill('preview');
  await page.locator('.login-form button').click();
  await expect(page).toHaveURL(/\/web\/dashboard$/);
}

test.describe('runtime capability pages', () => {
  const cases = [
    {
      modelId: 'M11R2',
      menu: 'setting',
      route: 'sfp',
      pageSelector: '.radio-card-group-container',
    },
    {
      modelId: 'M13R0',
      menu: 'setting',
      route: 'fan',
      pageSelector: '.radio-card-group-container',
    },
    {
      modelId: 'M16R0',
      menu: 'setting',
      route: 'powersupply',
      pageSelector: '.radio-group-container',
    },
    {
      modelId: 'M6R0',
      menu: 'advance',
      route: 'frozen-config',
      pageSelector: '.page.frozen',
    },
  ];

  cases.forEach(({ modelId, menu, route, pageSelector }) => {
    test(`${modelId} opens its existing ${route} page`, async ({ page }) => {
      generateIdentityFixture({ modelId, customerId: '0001' });
      const pageErrors: string[] = [];
      page.on('pageerror', error => pageErrors.push(error.message));

      await login(page);
      await page.locator(`[data-e2e="nav-${menu}"]`).click();
      await expect(page.locator(`[data-e2e="aside-${route}"]`)).toBeVisible();
      await page.locator(`[data-e2e="aside-${route}"]`).click();

      await expect(page).toHaveURL(new RegExp(`/web/(?:setting|advance)/${route}$`));
      await expect(page.locator(pageSelector)).toBeVisible();
      expect(pageErrors).toEqual([]);
    });
  });

  test('Mesh Add opens the existing M6s flow', async ({ page }) => {
    generateIdentityFixture({ modelId: 'M11R4', customerId: '0001' });
    await login(page);
    await page.goto('/web/mesh/add');
    await expect(page.locator('.choose__add__type')).toBeVisible();
  });
});
