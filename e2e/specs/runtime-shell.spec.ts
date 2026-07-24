import { test, expect } from '@playwright/test';
import { generateIdentityFixture, openApp } from '../fixtures/runtime-config';

test.describe('runtime Base UI shell', () => {
  test.beforeAll(() => {
    generateIdentityFixture({ modelId: 'M11R4', customerId: '0001' });
  });

  test('logs in and shows Base dashboard and secondary menus without page errors', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    await openApp(page);
    await expect(page.locator('html')).toHaveClass(/light/);
    await expect(page.locator('.login__left')).toBeVisible();
    await expect(page.locator('.login__right .center-form')).toBeVisible();
    await expect(page.locator('.login__right .logo img')).toBeVisible();
    await expect(page.locator('.login__right .download .qr img')).toBeVisible();
    const loginButtonBackground = await page.locator('.login-form button').evaluate(
      element => getComputedStyle(element).backgroundImage
    );
    expect(loginButtonBackground).toContain('linear-gradient');
    expect(loginButtonBackground).toContain('rgb(214, 0, 28)');
    await page.locator('input[type="password"]').fill('preview');
    await page.locator('.login-form button').click();

    await expect(page).toHaveURL(/\/web\/dashboard$/);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    await expect(page.locator('[data-e2e="dashboard-device-card"]')).toBeVisible();
    await expect(page.locator('.logo-wrap__logo img')).toBeVisible();
    const lightLogoUrl = await page.locator('.logo-wrap__logo img').getAttribute('src');
    const selectedMenuBackground = await page
      .locator('.nav-item.selected .iconfont')
      .first()
      .evaluate(element => getComputedStyle(element).backgroundImage);
    expect(selectedMenuBackground).toContain('linear-gradient');
    expect(selectedMenuBackground).toContain('rgb(214, 0, 28)');

    await page.locator('[data-e2e="nav-theme"]').click();
    await expect(page.locator('[data-e2e="theme-modal"]')).toBeVisible();
    await page.locator('[data-e2e="theme-option-dark"]').click();
    await page.locator('[data-e2e="theme-confirm"]').click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('.logo-wrap__logo img')).not.toHaveAttribute('src', lightLogoUrl || '');

    await page.locator('[data-e2e="nav-setting"]').click();
    await expect(page.locator('[data-e2e="aside-wan"]')).toBeVisible();
    await page.locator('[data-e2e="aside-wan"]').click();
    await expect(page).toHaveURL(/\/web\/setting\/wan$/);

    await page.locator('[data-e2e="nav-advance"]').click();
    await expect(page.locator('[data-e2e="aside-dhcp"]')).toBeVisible();

    await page.locator('[data-e2e="nav-upgrade"]').click();
    await expect(page.locator('[data-e2e="aside-offline"]')).toBeVisible();

    await page.locator('[data-e2e="footer-language"]').hover();
    await page.locator('[data-e2e="language-zh-CN"]').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/web\/upgrade\/(?:online|offline)$/);
    await expect(page.locator('[data-e2e="footer-language"]')).toContainText('简体中文');
    expect(await page.evaluate(() => localStorage.getItem('lang'))).toBe('zh-CN');

    await page.locator('[data-e2e="footer-logout"]').click();
    await expect(page.locator('.dialog-container')).toBeVisible();
    await page.locator('.dialog-container .dialog-buttons .btn').last().click();
    await expect(page).toHaveURL(/\/web\/login$/);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
