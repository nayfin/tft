import {
  test,
  expect,
  getMatFormField,
  selectOption,
} from '@tft/crispr-forms-testing';

test.describe('Hidden (hideDisabled) fields', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/features/disabled-field');
  });

  test('a hidden field leaves no empty slot or gap in a flex row', async ({
    page,
  }) => {
    const form = page.locator('crispr-form.row-form form');
    // The field hosts, in config order (the `grow` class is set on each host). The hidden field's content is
    // removed when it is hidden, so it can't be found by its test id.
    const fields = form.locator(':scope > .grow');
    const first = fields.nth(0);
    const hidden = fields.nth(1);
    const last = fields.nth(2);
    const enabler = fields.nth(3);
    const gap = 16;

    // All four fields share the row evenly while the field is shown
    await selectOption(page, 'rowEnabler', 'Show');
    await expect(getMatFormField(page, 'rowHidden')).toBeVisible();
    await expect(page.locator('mat-option')).toHaveCount(0);
    const formBox = (await form.boundingBox())!;
    const firstShown = (await first.boundingBox())!;
    expect(
      Math.abs(firstShown.width - (formBox.width - 3 * gap) / 4)
    ).toBeLessThanOrEqual(1);

    await selectOption(page, 'rowEnabler', 'Hide');
    await expect(getMatFormField(page, 'rowHidden')).toBeHidden();

    // The hidden field's own host is out of the layout, not an empty flex item
    await expect(hidden).toHaveCSS('display', 'none');

    // The three remaining fields share the row, with two gaps between them
    const firstBox = (await first.boundingBox())!;
    const lastBox = (await last.boundingBox())!;
    const enablerBox = (await enabler.boundingBox())!;
    const expectedWidth = (formBox.width - 2 * gap) / 3;
    expect(
      Math.abs(firstBox.width - expectedWidth),
      `first width ${firstBox.width}, expected ${expectedWidth}`
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(lastBox.x - (firstBox.x + firstBox.width + gap)),
      `gap between first and last`
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(enablerBox.x - (lastBox.x + lastBox.width + gap)),
      `gap between last and enabler`
    ).toBeLessThanOrEqual(1);

    // Showing the field again restores the four-way split
    await selectOption(page, 'rowEnabler', 'Show');
    await expect(getMatFormField(page, 'rowHidden')).toBeVisible();
    const firstBack = (await first.boundingBox())!;
    expect(
      Math.abs(firstBack.width - (formBox.width - 3 * gap) / 4)
    ).toBeLessThanOrEqual(1);
  });
});
