import type { Page } from '@playwright/test';

import { byE2E } from './selectors';
import { waitForLoginReady, waitForShellReady } from './wait';

export const loginWithPassword = async (page: Page, password: string) => {
  await page.goto('/login');
  await waitForLoginReady(page);
  await page.locator(byE2E('login-password')).fill(password);
  await page.locator(byE2E('login-submit')).click();
  await waitForShellReady(page);
};
