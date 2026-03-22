import { expect, test as base } from '@playwright/test';

import { ga630Expectations } from '../expectations/ga630';
import type { E2EProjectConfig } from '../projects/ga630';
import { loginWithPassword } from '../helpers/auth';

type AppFixtures = {
  projectConfig: E2EProjectConfig;
  expectations: typeof ga630Expectations;
  loginToShell: () => Promise<void>;
};

export const test = base.extend<AppFixtures>({
  projectConfig: async ({}, use, testInfo) => {
    await use(testInfo.project.metadata as E2EProjectConfig);
  },
  expectations: async ({}, use) => {
    await use(ga630Expectations);
  },
  loginToShell: async ({ page }, use) => {
    await use(async () => {
      const password = process.env.PLAYWRIGHT_PASSWORD;

      if (!password) {
        throw new Error('PLAYWRIGHT_PASSWORD is required for login flow tests');
      }

      await loginWithPassword(page, password);
    });
  }
});

export { expect };
