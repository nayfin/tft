import { test, expect, Page } from '@playwright/test';
import type { RadioFieldConfig, SelectOption } from '@tft/crispr-forms';
import { Validators } from '@angular/forms';
import {
  getError,
  getRadioGroup,
  getRadioOption,
  selectRadioOption,
  submitForm,
} from '../helpers/form.helpers';

/**
 * Registers Playwright tests for a RADIO field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 *
 * Tests generated based on config:
 * - Always: renders the radio group
 * - If `label`: renders the label, and the group's accessible name is the label
 * - If `heading`: renders the heading, and without a `label` the group's accessible name is the heading text
 * - If `options` is an array: renders every option, and selecting an option checks it and unchecks the others
 * - If `Validators.required`: shows the required error under the group on submit, and clears it once an option is selected
 *
 * Options that are an observable, promise or function are not checked, the same as in `testSelectField`.
 *
 * The required tests assume the radio starts with nothing selected. A radio cannot be unselected through the UI,
 * so if one of its options is already checked (an initial value) those tests skip themselves.
 */
export function testRadioField(config: RadioFieldConfig) {
  /** The `crispr-radio-field` wrapper of this field, which holds its label and heading. */
  const field = (page: Page) =>
    page
      .locator('crispr-radio-field')
      .filter({ has: getRadioGroup(page, config.controlName) });

  test('renders the radio group', async ({ page }) => {
    await expect(getRadioGroup(page, config.controlName)).toBeVisible();
  });

  if (config.label) {
    test('renders label', async ({ page }) => {
      await expect(
        field(page).getByText(config.label, { exact: true })
      ).toBeVisible();
    });

    test('has the label as its accessible name', async ({ page }) => {
      await expect(
        page.getByRole('radiogroup', { name: config.label, exact: true })
      ).toHaveAttribute('data-testid', config.controlName);
    });
  }

  if (config.heading?.label) {
    test('renders heading', async ({ page }) => {
      await expect(
        field(page).getByText(config.heading.label, { exact: true })
      ).toBeVisible();
    });

    if (!config.label) {
      test('has the heading as its accessible name', async ({ page }) => {
        await expect(
          page.getByRole('radiogroup', {
            name: config.heading.label,
            exact: true,
          })
        ).toHaveAttribute('data-testid', config.controlName);
      });
    }
  }

  if (Array.isArray(config.options)) {
    const options = config.options as SelectOption[];

    test('renders every option', async ({ page }) => {
      await expect(
        getRadioGroup(page, config.controlName).getByRole('radio')
      ).toHaveCount(options.length);
      for (const option of options) {
        await expect(
          getRadioOption(page, config.controlName, option.label)
        ).toHaveCount(1);
      }
    });

    test('selecting an option checks it and unchecks the others', async ({
      page,
    }) => {
      for (const option of options) {
        await selectRadioOption(page, config.controlName, option.label);
        await expect(
          getRadioOption(page, config.controlName, option.label)
        ).toBeChecked();
        for (const other of options.filter((o) => o !== option)) {
          await expect(
            getRadioOption(page, config.controlName, other.label)
          ).not.toBeChecked();
        }
      }
    });
  }

  if (config.validators?.includes(Validators.required)) {
    /** Skips the test when an option is already checked, as the error needs an empty radio. Waits for the options first. */
    const skipIfPreselected = async (page: Page) => {
      const group = getRadioGroup(page, config.controlName);
      await expect(group.getByRole('radio').first()).toBeAttached();
      const checked = await group.getByRole('radio', { checked: true }).count();
      test.skip(
        checked > 0,
        'the radio starts with an option selected, so it cannot show the required error'
      );
    };

    test('shows required error under the group when submitted with nothing selected', async ({
      page,
    }) => {
      await skipIfPreselected(page);
      await submitForm(page);
      await expect(getError(page, config.controlName, 'radio')).toBeVisible();
    });

    test('clears the required error once an option is selected', async ({
      page,
    }) => {
      await skipIfPreselected(page);
      await submitForm(page);
      await expect(getError(page, config.controlName, 'radio')).toBeVisible();

      await getRadioGroup(page, config.controlName)
        .locator('mat-radio-button')
        .first()
        .click();

      await expect(getError(page, config.controlName, 'radio')).toHaveCount(0);
    });
  }
}
