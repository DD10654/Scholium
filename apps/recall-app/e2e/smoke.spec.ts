import { test, expect } from '@playwright/test';

test('app loads and renders initial page', async ({ page }) => {
  await page.goto('/');
  await expect(page).not.toHaveTitle('');
  await expect(page.locator('body')).not.toBeEmpty();
});
