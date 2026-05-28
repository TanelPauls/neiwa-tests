import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Login flow', async ({ page }) => {
  await page.goto(process.env.TEST_WEBSITE);

  await Promise.all([
    page.waitForURL('**/signin'),
    page.click('text=Sign in'),
  ]);

  await expect(page).toHaveTitle(/Access/);
});