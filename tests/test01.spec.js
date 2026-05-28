import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Basic sanity check', async ({ page }) => {
  await page.goto(process.env.TEST_WEBSITE);
  await expect(page).toHaveTitle(/Screen/);
});


