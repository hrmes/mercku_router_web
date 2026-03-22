import { test } from '../fixtures/app';

import { expectVisibleNavItems, openAppRoute } from '../helpers/navigation';

test.describe('GA630 navigation', () => {
  test('shows expected top-level navigation', async ({ page, expectations, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();
    await expectVisibleNavItems(page, expectations.visibleNavItems);
  });

  test('opens critical routes without leaving the app shell', async ({ page, expectations, loginToShell }) => {
    test.skip(!process.env.PLAYWRIGHT_PASSWORD, 'PLAYWRIGHT_PASSWORD is required');

    await loginToShell();

    for (const route of expectations.criticalRoutes) {
      await openAppRoute(page, route);
    }
  });
});
