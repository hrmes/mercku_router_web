import { expect, type Page } from '@playwright/test';

import { byE2E } from './selectors';
import { waitForShellReady } from './wait';

const withWebPrefix = (route: string) => (route.startsWith('/web') ? route : `/web${route}`);

export const expectVisibleNavItems = async (page: Page, items: string[]) => {
  for (const item of items) {
    await expect(page.locator(byE2E(item))).toBeVisible();
  }
};

export const openAppRoute = async (page: Page, route: string) => {
  const targetRoute = withWebPrefix(route);

  await page.goto(targetRoute);
  await waitForShellReady(page);
  await expect(page).toHaveURL(new RegExp(`${targetRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
};
