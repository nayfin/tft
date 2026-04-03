---
name: crispr-forms-testing
description: Instructions and patterns for writing Playwright E2E tests for forms built with @tft/crispr-forms, using the @tft/crispr-forms-testing helper library.
---

# CRISPR Forms E2E Testing Skill

This skill covers writing Playwright E2E tests for `@tft/crispr-forms` using the `@tft/crispr-forms-testing` helper library.

## 1. Setup

### Install
```bash
npm install -D @tft/crispr-forms-testing
```

### Import pattern
`@tft/crispr-forms-testing` re-exports `@angular/compiler` automatically (required for Ivy partial compilation in Node/Playwright). You do **not** need a separate fixture file — just import directly:

```ts
import { test, expect, testField, getMatFormField, testForm } from '@tft/crispr-forms-testing';
```

---

## 2. Config-driven testing with `testForm`

The primary pattern is to import your `FormConfig` and call `testForm` passing the form's config. This auto-dispatches to the correct field test factory for each field based on `controlType`:

```ts
import { test, testForm } from '@tft/crispr-forms-testing';
import { myFormConfig } from '../path/to/my-form.config';

test.describe('My Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-form-route');
  });

  testForm(myFormConfig);
});
```

`testForm` iterates all fields and calls `testField` for each. Non-control fields (heading, divider, button) are skipped automatically — no filtering needed.

If you need to test only specific fields, use `testField` directly:

```ts
import { test, testField } from '@tft/crispr-forms-testing';

test.describe('My Form', () => {
  test.beforeEach(async ({ page }) => page.goto('/my-form-route'));
  testField(myFormConfig.fields.find(f => f.controlName === 'email'));
});
```

---

## 3. Spec file location

- Spec files live in `apps/crispr-forms-e2e/src/specs/fields/`
- Field test factories live in `libs/crispr-forms-testing/src/field-tests/`
- Helper functions live in `libs/crispr-forms-testing/src/helpers/form.helpers.ts`

---

## 4. `testId` attribute pattern

Every crispr-forms field has `data-testid` set automatically from its control path:

| Context | `data-testid` value |
|---------|---------------------|
| Top-level field `firstName` | `firstName` |
| In a subGroup `address` | `address.firstName` |
| In a formGroupList `contacts` at index 2 | `contacts[2].firstName` |
| Doubly nested | `contacts[2].address.city` |

Pass these values to all helper functions as `controlName`/`testId`.

---

## 5. Helper functions

### Selecting nested fields

Use dot notation to target fields inside a `SUB_GROUP`, and bracket notation for `FORM_GROUP_LIST` items. These are passed directly to any helper function:

```ts
getInput(page, 'profile.firstName')          // field inside a SUB_GROUP named 'profile'
getInput(page, 'contacts[2].firstName')      // field inside a FORM_GROUP_LIST at index 2
getInput(page, 'contacts[2].address.city')   // doubly nested
```

### Locators
```ts
getMatFormField(page, testId)     // root [data-testid] element
getInput(page, testId)            // input inside the field
getLabel(page, testId)            // mat-label inside the field
getHint(page, testId)             // mat-hint inside the field
getMatSelect(page, testId)        // mat-select inside a select field
getCheckbox(page, testId)         // mat-checkbox element
getAutocompleteInput(page, testId) // the visible role="textbox" input in autocomplete (NOT the hidden formControlName anchor)
getError(page, testId, fieldType?) // <p class="tft-control-error"> paragraph
                                   // fieldType defaults to 'input'; pass kebab-case type for others:
                                   // 'select', 'autocomplete', 'autocomplete-chiplist',
                                   // 'checkbox', 'datepicker', 'textarea'
```

### Actions
```ts
touchInput(page, testId)          // click + Tab to blur
touchSelect(page, testId)         // open + Escape + Tab
touchCheckbox(page, testId)       // click + click + Tab (leaves unchecked, triggers requiredTrue)
touchAutocomplete(page, testId)   // click visible input + Tab
touchDatepicker(page, testId)     // click input + Tab
openSelect(page, testId)          // clicks mat-select to open the panel
selectOption(page, testId, label) // opens select and clicks the named option
submitForm(page, nth?)            // programmatically clicks crispr-form's hidden submit button
                                  // (index nth, defaults to 0)
```

---

## 6. Field test factories

Each factory is a function that registers `test()` calls conditioned on the config. Call them inside a `test.describe` block that has already navigated to the page.

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

### Adding a new field test factory
1. Create `libs/crispr-forms-testing/src/field-tests/<field-type>.tests.ts`
2. Export a `test<FieldType>Field(config: <FieldType>Config)` function
3. Add a `case '<controlType>':` branch in `field-test-factory.ts`
4. Export from `libs/crispr-forms-testing/src/index.ts`

---

## 7. Known quirks

### Autocomplete and chiplist: use `submitForm()` to trigger errors
Both fields use a hidden `display:none` `[formControlName]` anchor for validation. The visible input has no validators. Blurring the visible input does **not** touch the hidden control. Use `submitForm()` instead — it fires `ControlErrorsFormDirective.submit$` which forces all controls to display errors regardless of touched state.

```ts
await submitForm(page);
await expect(getError(page, config.controlName, 'autocomplete-chiplist')).toBeVisible();
```

### `submitForm()` must use `page.evaluate`
The hidden submit button is `display:none`, so Playwright pointer events can't reach it. Internally it calls `document.querySelector('[data-testid="submit-trigger"]').click()` via `page.evaluate`.

### `touchSelect()` requires Tab after Escape
Pressing Escape dismisses the mat-select panel but leaves the trigger element focused. `ControlErrorsDirective` listens for `blur` events. Without the Tab press, no blur fires and no error appears.

### `getError()` targets the inner `<p>`, not the host element
`tft-control-error` host elements are always in the DOM (even when empty). Autocomplete/chiplist render two of them (one per internal input). Target `p.tft-control-error` (only present when there is error text) to avoid Playwright strict-mode failures.

### Slider: plain `<label>`, not `mat-label`
Slider is not inside a `mat-form-field`. `getLabel()` queries `mat-label` and won't work — use `.locator('label')` on the slider host instead.

### Slider: min/max are native HTML attributes
Read `min`/`max` from `input[matSliderThumb]` native HTML attributes, not `aria-valuemin`/`aria-valuemax`.

### Unit conversion: required errors are not testable
The `displayValueControl` (visible input) is separate from the `[formControlName]` that holds validators. Validation errors are never wired to the visible input.

---

## 8. Running the tests

```bash
npx nx run crispr-forms-e2e:e2e --reporter=list
```