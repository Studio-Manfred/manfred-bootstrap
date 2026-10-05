import { test, expect } from '@playwright/test';

test('golden path: hero → existing tab → copy → /plugins → copy', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /manfred bootstrap/i })).toBeVisible();
  await page.getByRole('link', { name: /add to an existing repo/i }).click();
  await expect(page).toHaveURL(/#existing$/);
  await page.getByRole('tab', { name: /existing project/i }).click();
  await page.getByRole('button', { name: /^copy command/i }).first().click();
  await expect(page.getByText(/copied/i).first()).toBeVisible();
  await page.goto('/plugins');
  await expect(page.getByTestId('plugin-card')).toHaveCount(11);
  await page.getByRole('button', { name: /^copy command/i }).first().click();
  await expect(page.getByText(/copied/i).first()).toBeVisible();
});
