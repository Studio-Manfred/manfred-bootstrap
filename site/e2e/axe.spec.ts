import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/plugins']) {
  for (const theme of ['light', 'dark'] as const) {
    test(`axe clean on ${route} in ${theme}`, async ({ page }) => {
      await page.goto(route);
      await page.evaluate((t) => {
        const el = document.documentElement;
        el.setAttribute('data-theme', t);
        el.classList.remove('light', 'dark');
        el.classList.add(t);
      }, theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
