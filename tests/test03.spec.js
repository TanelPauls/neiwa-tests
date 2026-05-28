import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Auth test with correct password', async ({ page }) => {

  await page.goto(process.env.SIGNIN_PAGE);

  await page.fill('input[type="email"]', process.env.EMAIL);
  await page.fill('input[type="password"]', process.env.PASSWORD);

  await Promise.all([
    page.waitForURL('**/home'),
    page.click('button[type="submit"]'),
  ]);

  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});
