import {
  test,
  expect,
  getMatFormField,
  getError,
  submitForm,
  Page,
} from '@tft/crispr-forms-testing';
import type { RadioFieldConfig, SelectOption } from '@tft/crispr-forms/utils';
import {
  radioFormConfig,
  radioInitialValue,
} from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/radio/radio.config';

// `testForm` has no radio case and skips radio fields, so the radio field is tested here.
const radioConfig = (controlName: string) =>
  radioFormConfig.fields.find(
    (field) => 'controlName' in field && field.controlName === controlName
  ) as RadioFieldConfig;

/** The labels of an option array in the config. */
const labelsOf = (controlName: string) =>
  (radioConfig(controlName).options as SelectOption[]).map(
    (option) => option.label
  );

const group = (page: Page, testId: string) => getMatFormField(page, testId);
const radio = (page: Page, testId: string, label: string) =>
  group(page, testId).getByRole('radio', { name: label, exact: true });
/** The visible label of an option, which is what a user clicks. */
const pick = (page: Page, testId: string, label: string) =>
  group(page, testId)
    .locator('mat-radio-button')
    .filter({ hasText: label })
    .click();

test.describe('Radio Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/radio');
  });

  test('renders every option of each radio group with its label', async ({
    page,
  }) => {
    for (const controlName of [
      'radioField',
      'optionalRadio',
      'preselectedRadio',
    ]) {
      await expect(group(page, controlName)).toHaveCount(1);
      await expect(group(page, controlName).getByRole('radio')).toHaveCount(
        labelsOf(controlName).length
      );
      for (const label of labelsOf(controlName)) {
        await expect(radio(page, controlName, label)).toHaveCount(1);
      }
    }
  });

  test('renders the heading as the caption of the group', async ({ page }) => {
    await expect(
      page
        .locator('crispr-radio-field')
        .filter({ has: page.locator('[data-testid="radioField"]') })
        .locator('crispr-heading')
    ).toHaveText('Radio Field');
  });

  test('starts with nothing selected', async ({ page }) => {
    for (const label of labelsOf('radioField')) {
      await expect(radio(page, 'radioField', label)).not.toBeChecked();
    }
  });

  test('selecting an option checks it and leaves the others unchecked', async ({
    page,
  }) => {
    const [first, second, third] = labelsOf('radioField');

    await pick(page, 'radioField', second);
    await expect(radio(page, 'radioField', second)).toBeChecked();
    await expect(radio(page, 'radioField', first)).not.toBeChecked();
    await expect(radio(page, 'radioField', third)).not.toBeChecked();

    await pick(page, 'radioField', third);
    await expect(radio(page, 'radioField', third)).toBeChecked();
    await expect(radio(page, 'radioField', second)).not.toBeChecked();
    await expect(radio(page, 'radioField', first)).not.toBeChecked();
  });

  const error = (page: Page, testId: string) => getError(page, testId, 'radio');
  const errors = (page: Page) => page.locator('p.tft-control-error');

  test('shows the required error on submit when nothing is selected', async ({
    page,
  }) => {
    await expect(errors(page)).toHaveCount(0);

    await submitForm(page);

    await expect(errors(page)).toHaveCount(1);
    await expect(error(page, 'radioField')).toHaveText('This field is required');
    await expect(group(page, 'radioField')).toHaveClass(/ng-invalid/);
  });

  test('renders the required error directly under its radio group', async ({
    page,
  }) => {
    await submitForm(page);

    // the error is the group's next sibling inside its own field, not at the end of the form
    await expect(
      page.locator(
        'crispr-radio-field:has([data-testid="radioField"]) mat-radio-group[data-testid="radioField"] + tft-control-error p.tft-control-error'
      )
    ).toHaveText('This field is required');
  });

  test('clears the required error once an option is selected', async ({
    page,
  }) => {
    await submitForm(page);
    await expect(error(page, 'radioField')).toHaveText('This field is required');

    await pick(page, 'radioField', labelsOf('radioField')[0]);

    await expect(errors(page)).toHaveCount(0);
    await expect(group(page, 'radioField')).toHaveClass(/ng-valid/);
  });

  test('shows no error on submit for the optional radio', async ({ page }) => {
    await submitForm(page);

    await expect(group(page, 'radioField')).toHaveClass(/ng-invalid/);
    await expect(group(page, 'optionalRadio')).toHaveClass(/ng-valid/);
    // only the required radio has an error
    await expect(errors(page)).toHaveCount(1);
    await expect(error(page, 'optionalRadio')).toHaveCount(0);
  });

  test('can select, then switch, the optional radio and its false value', async ({
    page,
  }) => {
    await pick(page, 'optionalRadio', 'No');
    await expect(radio(page, 'optionalRadio', 'No')).toBeChecked();
    await expect(radio(page, 'optionalRadio', 'Yes')).not.toBeChecked();

    await pick(page, 'optionalRadio', 'Yes');
    await expect(radio(page, 'optionalRadio', 'Yes')).toBeChecked();
    await expect(radio(page, 'optionalRadio', 'No')).not.toBeChecked();
  });

  test('renders the options of an observable once it emits', async ({
    page,
  }) => {
    await expect(group(page, 'observableRadio').getByRole('radio')).toHaveCount(
      2
    );
    await pick(page, 'observableRadio', 'Evil');
    await expect(radio(page, 'observableRadio', 'Evil')).toBeChecked();
    await expect(radio(page, 'observableRadio', 'Good')).not.toBeChecked();
  });

  test('preselects the option given as the initial value', async ({ page }) => {
    const options = radioConfig('preselectedRadio').options as SelectOption[];
    const preselected = options.find(
      (option) => option.value === radioInitialValue.preselectedRadio
    );

    await expect(
      radio(page, 'preselectedRadio', preselected.label)
    ).toBeChecked();
    for (const option of options.filter((o) => o !== preselected)) {
      await expect(
        radio(page, 'preselectedRadio', option.label)
      ).not.toBeChecked();
    }
  });
});
