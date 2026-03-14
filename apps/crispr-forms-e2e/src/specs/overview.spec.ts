import { test } from '../fixtures/angular-test';

test('overview page screenshot', async ({ page }) => {
  await page.goto('/crispr-forms-demo/overview');
  await page.waitForTimeout(500);
  const scroller = page.locator('mat-sidenav-content').first();
  await page.screenshot({ path: 'dist/.playwright/overview-1.png' });
  await scroller.evaluate(el => el.scrollBy(0, 700));
  await page.screenshot({ path: 'dist/.playwright/overview-2.png' });
  await scroller.evaluate(el => el.scrollBy(0, 700));
  await page.screenshot({ path: 'dist/.playwright/overview-3.png' });
  await scroller.evaluate(el => el.scrollBy(0, 700));
  await page.screenshot({ path: 'dist/.playwright/overview-4.png' });
  await scroller.evaluate(el => el.scrollBy(0, 700));
  await page.screenshot({ path: 'dist/.playwright/overview-5.png' });
});
