import {
  test,
  expect,
  testForm,
  getError,
  getRadioGroup,
  getRadioOption,
  selectRadioOption,
  submitForm,
  Page,
} from '@tft/crispr-forms-testing';
import type { RadioFieldConfig, SelectOption } from '@tft/crispr-forms/utils';
import {
  radioFormConfig,
  radioInitialValue,
} from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/radio/radio.config';

const radioConfig = (controlName: string) =>
  radioFormConfig.fields.find(
    (field) => 'controlName' in field && field.controlName === controlName
  ) as RadioFieldConfig;

const errors = (page: Page) => page.locator('p.tft-control-error');

test.describe('Radio Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/radio');
  });

  // Generated from the config: the group, its label and heading, its accessible name, its options and selecting
  // them, and the required error (see `testRadioField`). The tests below are what the config cannot tell the factory.
  testForm(radioFormConfig);

  test('starts with nothing selected', async ({ page }) => {
    for (const option of radioConfig('radioField').options as SelectOption[]) {
      await expect(
        getRadioOption(page, 'radioField', option.label)
      ).not.toBeChecked();
    }
  });

  test('names a radio with both a label and a heading by its label, not its heading', async ({
    page,
  }) => {
    const config = radioConfig('preselectedRadio');

    await expect(
      page.getByRole('radiogroup', { name: config.heading.label, exact: true })
    ).toHaveCount(0);
  });

  test('shows the default required message under the group', async ({
    page,
  }) => {
    await expect(errors(page)).toHaveCount(0);

    await submitForm(page);

    await expect(errors(page)).toHaveCount(1);
    await expect(getError(page, 'radioField', 'radio')).toHaveText(
      'This field is required'
    );
    await expect(getRadioGroup(page, 'radioField')).toHaveClass(/ng-invalid/);
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

  test('shows no error on submit for the optional radio', async ({ page }) => {
    await submitForm(page);

    await expect(getRadioGroup(page, 'radioField')).toHaveClass(/ng-invalid/);
    await expect(getRadioGroup(page, 'optionalRadio')).toHaveClass(/ng-valid/);
    // only the required radio has an error
    await expect(errors(page)).toHaveCount(1);
    await expect(getError(page, 'optionalRadio', 'radio')).toHaveCount(0);
  });

  test('can select, then switch, the optional radio and its false value', async ({
    page,
  }) => {
    await selectRadioOption(page, 'optionalRadio', 'No');
    await expect(getRadioOption(page, 'optionalRadio', 'No')).toBeChecked();
    await expect(
      getRadioOption(page, 'optionalRadio', 'Yes')
    ).not.toBeChecked();

    await selectRadioOption(page, 'optionalRadio', 'Yes');
    await expect(getRadioOption(page, 'optionalRadio', 'Yes')).toBeChecked();
    await expect(getRadioOption(page, 'optionalRadio', 'No')).not.toBeChecked();
  });

  // the factory only checks static option arrays, so the observable options are checked here
  test('renders the options of an observable once it emits', async ({
    page,
  }) => {
    await expect(
      getRadioGroup(page, 'observableRadio').getByRole('radio')
    ).toHaveCount(2);
    await selectRadioOption(page, 'observableRadio', 'Evil');
    await expect(getRadioOption(page, 'observableRadio', 'Evil')).toBeChecked();
    await expect(
      getRadioOption(page, 'observableRadio', 'Good')
    ).not.toBeChecked();
  });

  test('preselects the option given as the initial value', async ({ page }) => {
    const options = radioConfig('preselectedRadio').options as SelectOption[];
    const preselected = options.find(
      (option) => option.value === radioInitialValue.preselectedRadio
    );

    await expect(
      getRadioOption(page, 'preselectedRadio', preselected.label)
    ).toBeChecked();
    for (const option of options.filter((o) => o !== preselected)) {
      await expect(
        getRadioOption(page, 'preselectedRadio', option.label)
      ).not.toBeChecked();
    }
  });
});
