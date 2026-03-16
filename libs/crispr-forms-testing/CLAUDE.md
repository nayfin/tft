# crispr-forms-testing

Playwright helpers and field test factories for testing forms built with `@tft/crispr-forms`.

## Setup

### 1. Load the Angular JIT compiler
The lib re-exports `@angular/compiler` automatically when you import from it. You do NOT need a separate fixture file — just import directly:

```ts
import { testField, getMatFormField } from '@tft/crispr-forms-testing';
```

If you are NOT importing from this lib in a given file, add this at the top of your Playwright setup or fixture:
```ts
import '@angular/compiler';
```

### 2. Use `testField` to generate standard assertions from a config
```ts
import { test } from '@playwright/test';
import { testField } from '@tft/crispr-forms-testing';
import { myFormConfig } from './my-form.config';

test.describe('My Form', () => {
  test.beforeEach(async ({ page }) => page.goto('/my-form'));
  for (const field of myFormConfig.fields) {
    testField(field);
  }
});
```

## testId attribute pattern

Every crispr-forms field has `data-testid` set automatically. The value is the full control path:

| Context | testId value |
|---------|-------------|
| Top-level field `firstName` | `firstName` |
| In a subGroup `address` | `address.firstName` |
| In a formGroupList `contacts` at index 2 | `contacts[2].firstName` |
| Doubly-nested | `contacts[2].address.city` |

## Helper functions

### Locators
- `getMatFormField(page, testId)` — the root element with `data-testid` (usually `mat-form-field`, `mat-checkbox`, or `mat-slider`)
- `getInput(page, testId)` — `input` inside the field
- `getLabel(page, testId)` — `mat-label` inside the field
- `getHint(page, testId)` — `mat-hint` inside the field
- `getMatSelect(page, testId)` — `mat-select` inside a select field
- `getCheckbox(page, testId)` — `mat-checkbox` element
- `getAutocompleteInput(page, testId)` — the visible `role="textbox"` input in autocomplete (NOT the hidden formControlName anchor)
- `getError(page, testId, fieldType?)` — the `<p class="tft-control-error">` paragraph. `fieldType` defaults to `'input'`; pass the field's kebab-case type for other fields (e.g. `'select'`, `'autocomplete'`, `'autocomplete-chiplist'`, `'checkbox'`, `'datepicker'`, `'textarea'`)

### Actions
- `touchInput(page, testId)` — click + Tab to blur
- `touchSelect(page, testId)` — open + Escape + Tab (Tab is required; Escape alone does not fire blur)
- `touchCheckbox(page, testId)` — click + click + Tab (leaves unchecked, triggers requiredTrue)
- `touchAutocomplete(page, testId)` — click visible input + Tab
- `touchDatepicker(page, testId)` — click input + Tab
- `openSelect(page, testId)` — clicks mat-select to open panel
- `selectOption(page, testId, optionLabel)` — opens select and clicks the option
- `submitForm(page, nth?)` — programmatically clicks crispr-form's hidden submit button (index `nth`, defaults to 0)

## Known quirks

### Autocomplete and chiplist: use submitForm() to trigger errors
Both fields use a hidden `display:none` `[formControlName]` anchor for validation. The visible input has no validators. Blurring the visible input does NOT touch the hidden control. Use `submitForm()` instead — it fires `ControlErrorsFormDirective.submit$` which forces all controls to display errors regardless of touched state.

### submitForm() must use page.evaluate
The hidden submit button is `display:none`, so Playwright pointer events can't reach it. `submitForm()` calls `document.querySelector('[data-testid="submit-trigger"]').click()` via `page.evaluate`.

### touchSelect() requires Tab after Escape
Pressing Escape dismisses the mat-select panel but leaves the trigger element focused. `ControlErrorsDirective` listens for `blur` events. Without the Tab press, no blur fires and the error never appears.

### getError() targets the inner <p>, not the host element
`tft-control-error` host elements are always in the DOM (even when empty). Autocomplete/chiplist render two of them (one per internal input). Targeting `p.tft-control-error` (the inner paragraph, only present when there is error text) avoids Playwright strict-mode failures.

### Slider: plain <label>, not mat-label
Slider is not inside a `mat-form-field`, so it uses a plain `<label>`. `getLabel()` (which queries `mat-label`) won't work — query `.locator('label')` on the slider host instead.

### Slider: min/max are native HTML attributes
Read `min`/`max` from `input[matSliderThumb]` native HTML attributes, not `aria-valuemin`/`aria-valuemax`.

### Unit conversion: required errors are not testable
The `displayValueControl` (visible input) is separate from the `[formControlName]` that holds validators. Validation errors are never wired to the visible input, so required error tests are not possible for this field type.

## Field test factories

Each factory registers Playwright `test()` calls conditioned on the config:

| Factory | Config type | Tests generated |
|---------|-------------|-----------------|
| `testInputField` | `InputFieldConfig` | label, input type, placeholder, hint, required, min, max, maxLength |
| `testTextareaField` | `TextareaFieldConfig` | label, hint, required |
| `testCheckboxField` | `CheckboxFieldConfig` | label, requiredTrue error |
| `testSelectField` | `SelectFieldConfig` | label, hint, options count, select option, required |
| `testDatepickerField` | `DatepickerFieldConfig` | label, hint, toggle button, required |
| `testSliderField` | `SliderFieldConfig` | renders, label, min, max |
| `testAutocompleteField` | `AutocompleteFieldConfig` | label, hint, dropdown, select option, required (via submitForm) |
| `testAutocompleteChiplistField` | `AutocompleteChiplistFieldConfig` | label, hint, type+see options, add chip, remove chip, minArrayLength error |
| `testFileUploadField` | `FileUploadFieldConfig` | label, drop zone text, select button |
| `testUnitConversionField` | `UnitConversionFieldConfig` | label, number input, unit select |
| `testField` | `AnyFieldConfig` | dispatches to the correct factory above; skips non-control fields |
