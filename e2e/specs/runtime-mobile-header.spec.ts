import { test, expect } from '@playwright/test';
import { generateIdentityFixture, openApp } from '../fixtures/runtime-config';

test.describe('runtime mobile header', () => {
  test.beforeAll(() => {
    generateIdentityFixture({ modelId: 'M11R4', customerId: '0032' });
  });

  test('keeps language and menu controls when resizing from desktop to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openApp(page);
    await page.locator('input[type="password"]').fill('preview');
    await page.locator('.login-form button').click();
    await expect(page).toHaveURL(/\/web\/dashboard$/);

    await page.setViewportSize({ width: 390, height: 844 });

    await expect(page.locator('.menu-icon.language')).toBeVisible();
    await expect(page.locator('.menu-icon.menu')).toBeVisible();
    await page.locator('.menu-icon.menu').click();
    await expect(page.locator('[data-e2e="nav-root-mobile"]')).toBeVisible();
  });
});
