import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { byE2E } from './selectors';

export const waitForLoginReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.locator(byE2E('login-password')).waitFor();
};

export const waitForShellReady = async (page: Page) => {
  await page.locator(byE2E('app-shell')).waitFor();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.locator(byE2E('nav-setting')).waitFor();
};
