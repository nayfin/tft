import { test, expect, Page } from '@tft/crispr-forms-testing';

/**
 * The overview demo opts in to `showInvalidErrors` and lists `crisprForm.invalidFields()` in an "Invalid fields" panel.
 */
test.describe('Invalid fields summary', () => {
  const snackBar = (page: Page) => page.locator('mat-snack-bar-container');
  const panelItems = (page: Page) =>
    page.locator('[data-testid="invalid-field-item"]');
  const snackBarItems = (page: Page) => snackBar(page).locator('li');
  const submitButton = (page: Page) =>
    page.getByRole('button', { name: 'TRIGGER SUBMIT FROM OUTSIDE FORM' });

  /** The number shown in the panel. */
  const panelCount = async (page: Page) =>
    Number(
      await page.locator('[data-testid="invalid-fields-count"]').innerText()
    );

  /** The "label: message" text of each list item, without the layout whitespace. */
  const texts = async (items: ReturnType<typeof panelItems>) =>
    (await items.allInnerTexts()).map((text) =>
      text.replace(/\s+/g, ' ').trim()
    );

  const textarea = (page: Page) =>
    page.locator('[data-testid="textareaInput"] textarea');

  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/overview');
    // the form is built and its initial value applied once the first name shows it
    await expect(page.locator('[data-testid="inputField"] input')).toHaveValue(
      'Hello'
    );
    await expect(panelItems(page).first()).toBeVisible();
  });

  test('lists the invalid fields before any submit, without a snack bar', async ({
    page,
  }) => {
    await expect(snackBar(page)).toHaveCount(0);

    const count = await panelCount(page);
    expect(count).toBeGreaterThan(0);
    await expect(panelItems(page)).toHaveCount(count);
    for (const text of await texts(panelItems(page))) {
      expect(text).toContain('I am a custom error message on a required field');
    }
  });

  test('opens one snack bar listing the panel fields on an invalid submit', async ({
    page,
  }) => {
    const count = await panelCount(page);
    const expected = await texts(panelItems(page));

    await submitButton(page).click();

    await expect(snackBar(page)).toHaveCount(1);
    await expect(snackBar(page)).toContainText(
      new RegExp(`Fix ${count} fields? to continue`)
    );
    await expect(snackBarItems(page)).toHaveCount(count);
    expect(await texts(snackBarItems(page))).toEqual(expected);
  });

  test('shows the number of fields emitted by invalidSubmit', async ({
    page,
  }) => {
    const count = await panelCount(page);
    await expect(
      page.locator('[data-testid="last-invalid-submit"]')
    ).toContainText('none yet');

    await submitButton(page).click();

    await expect(
      page.locator('[data-testid="last-invalid-submit"]')
    ).toContainText(new RegExp(`Last invalid submit:\\s*${count} fields?`));
  });

  test('closes the snack bar with the dismiss button', async ({ page }) => {
    await submitButton(page).click();
    await expect(snackBar(page)).toHaveCount(1);

    await snackBar(page).getByRole('button', { name: 'Dismiss' }).click();

    await expect(snackBar(page)).toHaveCount(0);
  });

  test('leaves one snack bar after a second invalid submit', async ({
    page,
  }) => {
    await submitButton(page).click();
    await expect(snackBar(page)).toHaveCount(1);
    const first = await snackBar(page).elementHandle();

    await submitButton(page).click();

    // the first one is replaced, not kept alongside
    await page.waitForFunction((el) => !el.isConnected, first);
    await expect(snackBar(page)).toHaveCount(1);
  });

  test('drops a fixed field from the panel and from the next snack bar', async ({
    page,
  }) => {
    const before = await panelCount(page);
    const textareaLabel = 'I am a label to a textarea input';
    await expect(
      panelItems(page).filter({ hasText: textareaLabel })
    ).toHaveCount(1);

    await textarea(page).fill('now valid');

    await expect(
      page.locator('[data-testid="invalid-fields-count"]')
    ).toHaveText(String(before - 1));
    await expect(panelItems(page)).toHaveCount(before - 1);
    await expect(
      panelItems(page).filter({ hasText: textareaLabel })
    ).toHaveCount(0);

    await submitButton(page).click();

    await expect(snackBar(page)).toHaveCount(1);
    await expect(snackBar(page)).toContainText(
      new RegExp(`Fix ${before - 1} fields? to continue`)
    );
    await expect(snackBarItems(page)).toHaveCount(before - 1);
  });

  test('grows the panel again when a fixed field is cleared', async ({
    page,
  }) => {
    const before = await panelCount(page);
    await textarea(page).fill('now valid');
    await expect(panelItems(page)).toHaveCount(before - 1);

    await textarea(page).fill('');

    await expect(panelItems(page)).toHaveCount(before);
  });

  test('lists nothing and opens no snack bar once every field is fixed', async ({
    page,
  }) => {
    await textarea(page).fill('now valid');
    await page
      .locator('[data-testid="radioField"]')
      .getByText('Option A')
      .click();
    // the group list items are the other invalid fields, remove them one at a time (the one being edited has the delete button)
    const deleteItem = page
      .locator('.item-header mat-icon')
      .filter({ hasText: 'delete' });
    await deleteItem.click();
    await expect(panelItems(page).filter({ hasText: 'Step 2' })).toHaveCount(0);
    await deleteItem.click();

    await expect(
      page.locator('[data-testid="invalid-fields-count"]')
    ).toHaveText('0');
    await expect(
      page.locator('[data-testid="invalid-fields-empty"]')
    ).toHaveText('No invalid fields');
    await expect(panelItems(page)).toHaveCount(0);

    await submitButton(page).click();

    // a valid submit emits no invalidSubmit and opens no snack bar (the form opens it synchronously in its submit handler)
    await expect(
      page.locator('[data-testid="last-invalid-submit"]')
    ).toContainText('none yet');
    await expect(snackBar(page)).toHaveCount(0);
  });

  // the edit pencil of a group list item sits inside the form, so it must not be a submit button
  const editPencil = (page: Page) =>
    page.locator('.display-field-container').getByRole('button').first();

  test('opening a group list item for editing does not submit the form', async ({
    page,
  }) => {
    await editPencil(page).click();

    // the first item is open for editing now, so the click has been handled
    await expect(
      page.locator('[data-testid="groupList[0].secondSubField"] input')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="last-invalid-submit"]')
    ).toContainText('none yet');
    await expect(snackBar(page)).toHaveCount(0);
    await expect(page.locator('p.tft-control-error')).toHaveCount(0);
  });

  test('keeps what is typed into a group list item that was opened for editing', async ({
    page,
  }) => {
    await textarea(page).fill('x');
    await page
      .locator('[data-testid="radioField"]')
      .getByText('Option A')
      .click();
    await page
      .locator('[data-testid="groupList[1].subField"] input')
      .fill('Bo');
    await editPencil(page).click();
    const lastName = page.locator(
      '[data-testid="groupList[0].secondSubField"] input'
    );

    await lastName.fill('Diddley');

    // A click that submitted the form used to feed the form value back into it a moment later, which emptied the
    // field again. Asserting that nothing changes needs a wait.
    await page.waitForTimeout(1000);
    await expect(lastName).toHaveValue('Diddley');
  });
});
