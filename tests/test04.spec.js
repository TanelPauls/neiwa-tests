import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Test Case ID 2', async ({ page }) => {

  await page.goto(process.env.SIGNIN_PAGE);

  await page.fill('input[type="email"]', process.env.EMAIL);
  await page.fill('input[type="password"]', 'wrong_password_123');

  await page.click('button[type="submit"]');

  await expect(page.locator('#passwordError'))
    .toBeVisible();

  await expect(page.locator('#passwordError'))
    .toHaveText('Incorrect email or password.');
});
