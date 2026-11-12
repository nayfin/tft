# @tft/crispr-forms-testing

Playwright helpers and test factories for apps built with [`@tft/crispr-forms`](../crispr-forms/README.md).

Point it at the same `FormConfig` your component renders and it generates a standard set of e2e tests for every field, covering labels, hints, options and validation errors. When you need to write your own assertions, it also provides locators and actions that already handle Angular Material's quirks.

## Installation

```bash
npm install --save-dev @tft/crispr-forms-testing
```

Peer dependencies: `@playwright/test` (>= 1.40), `@angular/compiler` and `@angular/forms` (^21), and `@tft/crispr-forms`.

The package re-exports everything from `@playwright/test`, so a spec file needs only one import:

```ts
import { test, expect, testForm, getInput } from '@tft/crispr-forms-testing';
```

Importing the package also loads `@angular/compiler`. crispr-forms ships in partial-compilation (Ivy linker) format, and its configs need the JIT compiler to load in Node. If a Playwright file imports a crispr-forms config **without** importing this package, add `import '@angular/compiler';` at the top of it.

## Quick start

Keep your form config in its own file so the component and the spec can share it:

```ts
// profile.config.ts
export const profileFormConfig: FormConfig = {
  fields: [
    { controlType: ControlType.INPUT, controlName: 'name', label: 'Name', validators: [Validators.required] },
    { controlType: ControlType.SELECT, controlName: 'role', label: 'Role', options: [/* ... */] },
  ],
};
```

Then generate the tests from it:

```ts
// profile.spec.ts
import { test, testForm } from '@tft/crispr-forms-testing';
import { profileFormConfig } from '../app/profile/profile.config';

test.describe('Profile form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  testForm(profileFormConfig);
});
```

Because the tests are derived from the config, a validator added there is tested automatically.

To cover just some fields, call `testField` per field instead:

```ts
for (const field of profileFormConfig.fields) {
  testField(field);
}
```

## Generated tests

`testForm(config)` calls `testField` for every top-level field. `testField(config)` opens a `test.describe` named after the `controlName` and picks the factory for its `controlType`. Each factory only registers tests for what the config defines; a field without a `hint`, for example, gets no hint test.

| Control type | Factory | Tests |
|---|---|---|
| `INPUT` | `testInputField` | label, input type, placeholder, hint, required, min, max, maxLength |
| `TEXTAREA` | `testTextareaField` | label, hint, required |
| `CHECKBOX` | `testCheckboxField` | label, `requiredTrue` error |
| `SELECT` | `testSelectField` | label, hint, option count, selecting an option, required |
| `DATEPICKER` | `testDatepickerField` | label, hint, toggle button, required |
| `SLIDER` | `testSliderField` | renders, label, min, max |
| `AUTOCOMPLETE` | `testAutocompleteField` | label, hint, dropdown, selecting an option, required |
| `AUTOCOMPLETE_CHIPLIST` | `testAutocompleteChiplistField` | label, hint, typing shows options, add chip, remove chip, `minArrayLength` error |
| `FILE_UPLOAD` | `testFileUploadField` | label, drop zone text, select button |
| `UNIT_CONVERSION` | `testUnitConversionField` | label, number input, unit select |

`testForm` and `testField` do **not** cover:

- Fields without a `controlName` (headings, dividers, buttons). These are skipped.
- `SUB_GROUP` and `GROUP_LIST` children. Nested fields aren't walked; test them with the helpers below.
- `IMAGE_UPLOAD` and `MAP`. These have no factory yet.

The individual factories are exported too, if you want one suite for one field.

## Test ids

Every crispr-forms control renders a `data-testid` set to its control path. All helpers take this path as their `testId` argument.

| Field | `data-testid` |
|---|---|
| Top-level `firstName` | `firstName` |
| `firstName` in sub group `address` | `address.firstName` |
| `firstName` in group list `contacts`, item 2 | `contacts[2].firstName` |
| Nested in both | `contacts[2].address.city` |

Fields without a `controlName`, such as buttons, have no test id by default. Set `testId` on the field config to add one. Any parent prefix still applies, so `testId: 'save'` inside sub group `actions` renders `actions.save`.

## Helpers

### Locators

| Helper | Returns |
|---|---|
| `getMatFormField(page, testId)` | The element carrying the `data-testid`. Usually a `mat-form-field`, a `mat-checkbox` or a `mat-slider`. |
| `getInput(page, testId)` | The `input` inside the field |
| `getLabel(page, testId)` | The `mat-label` inside the field |
| `getHint(page, testId)` | The `mat-hint` inside the field |
| `getMatSelect(page, testId)` | The `mat-select` inside a select field |
| `getCheckbox(page, testId)` | The `mat-checkbox` element |
| `getAutocompleteInput(page, testId)` | The visible text input of an autocomplete or chiplist |
| `getError(page, testId, fieldType = 'input')` | The displayed error message. Pass the field's kebab-case type for non-input fields: `'select'`, `'textarea'`, `'checkbox'`, `'datepicker'`, `'autocomplete'` or `'autocomplete-chiplist'`. |

### Actions

| Helper | Does |
|---|---|
| `touchInput(page, testId)` | Clicks the input, then Tabs away to blur it |
| `touchSelect(page, testId)` | Opens the select, presses Escape, then Tabs away |
| `touchCheckbox(page, testId)` | Clicks twice, so the box ends unchecked, then Tabs away |
| `touchAutocomplete(page, testId)` | Clicks the visible input, then Tabs away |
| `touchDatepicker(page, testId)` | Clicks the input, then Tabs away |
| `openSelect(page, testId)` | Opens the select panel |
| `selectOption(page, testId, optionLabel)` | Opens the select and picks the option with that label |
| `submitForm(page, nth = 0)` | Submits the `nth` crispr form on the page, which shows every control's errors |

### Example

```ts
import { test, expect, getInput, getError, touchInput, submitForm } from '@tft/crispr-forms-testing';

test('name is required', async ({ page }) => {
  await page.goto('/profile');

  await touchInput(page, 'name');
  await expect(getError(page, 'name')).toHaveText('This field is required');

  await getInput(page, 'name').fill('Ada');
  await expect(getError(page, 'name')).toHaveCount(0);
});

test('nested list item shows its errors on submit', async ({ page }) => {
  await page.goto('/profile');
  await submitForm(page);
  await expect(getError(page, 'contacts[0].email')).toBeVisible();
});
```

## Gotchas

**Showing errors on autocomplete and chiplist fields.** Their validators are on a hidden control, not on the visible input, so blurring the input never touches the validated control. Call `submitForm(page)` instead: it forces every control in the form to display its errors.

**Why `submitForm` doesn't click.** crispr-forms submits through a hidden `display: none` button, which Playwright can't click. `submitForm` clicks it from inside the page with `page.evaluate`.

**Select fields need a Tab after Escape.** Escape closes the panel but leaves the select focused. Errors appear on blur, so `touchSelect` also presses Tab.

**`getError` targets the message, not the host.** The `tft-control-error` element is always in the DOM, even with no error, and autocomplete/chiplist fields render two of them. `getError` matches the inner `p.tft-control-error`, which only exists while a message is shown. That keeps Playwright's strict mode happy, and `toHaveCount(0)` reliably asserts "no error".

**Slider labels and bounds.** Sliders aren't inside a `mat-form-field`, so their label is a plain `<label>` and `getLabel` won't find it; use `getMatFormField(page, id).locator('label')`. Read min and max from the native `min`/`max` attributes on `input[matSliderThumb]`, not from `aria-valuemin`/`aria-valuemax`.

**Unit conversion `required` can't be tested.** The visible input is a separate control from the one that holds the validators, so a required error never shows on the field.
