import {
  test,
  expect,
  getError,
  getInput,
  submitForm,
} from '@tft/crispr-forms-testing';

test.describe('Group List Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/group-list');
  });

  test('passes initial item values to nested fields', async ({ page }) => {
    // plain input receives its initial value
    await expect(getInput(page, 'list[0].description')).toHaveValue('x');

    // chiplist (which only reads its `value` input) renders the initial chip
    const species = page.locator('[data-testid="list[0].species"]');
    await expect(
      species.locator('mat-chip-row').filter({ hasText: 'Kale' })
    ).toBeVisible();
  });

  test('initial chiplist value satisfies a required validator', async ({
    page,
  }) => {
    await expect(
      page
        .locator('[data-testid="list[0].species"] mat-chip-row')
        .filter({ hasText: 'Kale' })
    ).toBeVisible();

    await submitForm(page);

    await expect(
      getError(page, 'list[0].species', 'autocomplete-chiplist')
    ).toHaveCount(0);
  });
});
