# crispr-forms

Config-driven Angular Material form builder. Provide a `FormConfig` object → get a fully rendered, validated form.

## Import
```ts
import { FormConfig, ControlType } from '@tft/crispr-forms';
```
Add `CrisprFormComponent` to your component's `imports` (standalone). `CrisprFormsModule` is deprecated and will be removed in the next major version.

## Template
```html
<crispr-form [config]="config" (submitted)="handleSubmit($event)"></crispr-form>
```

## FormConfig shape
```ts
config: FormConfig = {
  autoComplete: 'off',
  validators: [],          // form-level validators
  errorDictionary: {},     // override error messages
  classes: [],             // CSS classes on form element
  showInvalidErrors: true, // opt in: snack bar listing the invalid fields on an invalid submit (or an InvalidErrorsConfig)
  fields: [ ...fieldConfigs ]
};
```

## Invalid fields
List what is wrong with the form in one place:
- `showInvalidErrors?: boolean | InvalidErrorsConfig` on `FormConfig` (off by default). On an invalid submit (button or `triggerSubmit()`) it opens one `MatSnackBar` (`Fix N field(s) to continue`, a `label: message` list, a Dismiss button). `InvalidErrorsConfig`: `duration` (ms, default 8000, 0 = until dismissed), `maxErrors` (default 5, the rest show as "+N more"), `dismissLabel` (default `'Dismiss'`). A second invalid submit replaces it. It does not move focus.
- `invalidFields` signal on `<crispr-form>`: `InvalidField[]` (`{ path, label, message, errorKey, control }`), one per invalid field in config order, regardless of touched state.
- `invalidSubmit` output: emits the same array when submitted while invalid. `submitted` still fires for every submit.
- `getInvalidFields(config, group, errorDictionary?)` is the pure function behind them. A leaf is named by `label` (else `heading.label`, else `controlName`), groups and lists by `heading.label` (else `controlName`), joined inside-out (`Street in Address`, `Photo in Photos 2`; `itemLabelBuilder(i)` names list items when set). A group's own validator error is listed only when none of its fields are. Messages come from `errorDictionary` before the defaults (`getErrorMessage` from `@tft/form-validation-handler`).
- Processing state: `<crispr-form>` has a `processingState` signal (`'idle' | 'processing' | 'failed'`, the aggregate of all `IMAGE_UPLOAD` fields incl. sub-groups and list items) and a `processingStateChange` output (changes only, not the initial `'idle'`). `getProcessingState(control)` is the pure function behind them. `IMAGE_UPLOAD` also has `compressionTimeoutMs` (default 30000, 0 disables; failure message "took too long", same `imageProcessingFailed` key), and its processing error comes before the config's validators.
- Code: `src/lib/utils/functions/getInvalidFields.ts`, `src/lib/form/form.component.ts`, `src/lib/form/invalid-fields-snack-bar/`.

## ControlType enum
`INPUT`, `SELECT`, `TEXTAREA`, `CHECKBOX`, `RADIO`, `AUTOCOMPLETE`, `AUTOCOMPLETE_CHIPLIST`,
`DATEPICKER`, `SLIDER`, `BUTTON`, `HEADING`, `DIVIDER`, `FILE_UPLOAD`, `IMAGE_UPLOAD`,
`MAP`, `UNIT_CONVERSION`, `GROUP_LIST`, `SUB_GROUP`, `CUSTOM`

## Common field config properties (on all control fields)
```ts
{
  controlType: ControlType.INPUT,
  controlName: 'myField',       // key in FormGroup value
  label: 'My Field',
  validators: [Validators.required],
  hint: 'helper text',
  placeholder: 'type here...',
  info: { content: 'tooltip text', tooltipPosition: 'above', iconName: 'info' },
  heading: { label: 'Section Title', typographyClass: 'mat-h2' },
  fieldSuffix: 'kg',
  appearance: 'outline',        // MatFormFieldAppearance
  color: 'primary',             // 'primary' | 'accent' | 'warn'
  classes: ['my-class'],
  hideDisabled: false,          // hide instead of grey-out when disabled
}
```

## Field-specific configs

### INPUT
```ts
{
  controlType: ControlType.INPUT,
  controlName: 'name',
  label: 'Name',
  inputType: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date',
  min: 0, max: 100,             // for number inputs
  valueAsNumber: true,          // only with inputType 'number': control value is a number (empty -> null). Default false = string; maxLength/pattern not applied in this mode
  autoComplete: 'off',
  autoCapitalize: 'off',
  spellcheck: true,
}
```

### SELECT
```ts
{
  controlType: ControlType.SELECT,
  controlName: 'role',
  label: 'Role',
  options: [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ],
}
```

### BUTTON (submit)
```ts
{
  controlType: ControlType.BUTTON,
  label: 'SUBMIT',
  buttonType: 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab',
}
```

### TEXTAREA
```ts
{ controlType: ControlType.TEXTAREA, controlName: 'bio', label: 'Bio' }
```

### CHECKBOX
```ts
{ controlType: ControlType.CHECKBOX, controlName: 'agree', label: 'I agree' }
```

### DATEPICKER
```ts
{
  controlType: ControlType.DATEPICKER,
  controlName: 'dob',
  label: 'Date of Birth',
  clearable: true,                    // opt-in small text button (no icon) next to the toggle; shown while the control has a value and is enabled. Default false
  clearButtonLabel: 'Remove date',    // the clear button's visible text. Default 'Clear'
}
```
Clicking the clear button sets the value to `null` and marks the control dirty and touched (so `required` shows its error).
Requires: `date-fns`, `@angular/material-date-fns-adapter`, and `MAT_DATE_LOCALE` provider in your application providers.

### UNIT_CONVERSION
```ts
{
  controlType: ControlType.UNIT_CONVERSION,
  controlName: 'length',
  label: 'Length',
  showUnitSelect: true,               // false: one fixed unit, shown with fieldSuffix
  initialDisplayUnit: 'ft',           // required with showUnitSelect: true
  selectableUnits: () => [{ value: 'ft', label: 'feet' }, { value: 'in', label: 'inch' }],
  // stored value -> number shown in the input. Receives the stored value unchanged (0 stays 0, missing is null).
  initialDisplayValueConversion: (stored, unit) => (stored == null ? null : toDisplay(stored, unit)),
  // number typed in the input -> value stored on the control. Runs on every change, and once on load.
  storedValueConversion: (display, unit) => (display === '' || display == null ? null : toStored(display, unit)),
}
```
The user types in the display unit and the control holds the converted stored value. Both conversions may return `null`: return `null` for an empty input when `null` (no measurement) and `0` mean different things, and the field stays `null` on load so a `required` field starts invalid. Returning `0` for an empty field makes `required` pass on load.
Validators are on the control, not the visible input, so a required error never shows on the field. See `libs/crispr-forms-testing/CLAUDE.md`.

### HEADING / DIVIDER
```ts
{ controlType: ControlType.HEADING, label: 'Section Title', typographyClass: 'mat-h2' }
{ controlType: ControlType.DIVIDER }
```

### SUB_GROUP
Nests a sub-FormGroup within the form:
```ts
{
  controlType: ControlType.SUB_GROUP,
  controlName: 'address',
  fields: [ ...nestedFieldConfigs ]
}
```

## Advanced: computeValue (derived fields)
Reactively compute a field's value from other fields using RxJS:
```ts
{
  controlType: ControlType.INPUT,
  controlName: 'product',
  label: 'Product (A × B)',
  computeValue: (group: FormGroup) =>
    combineLatest([
      group.get('factorA').valueChanges,
      group.get('factorB').valueChanges,
    ]).pipe(map(([a, b]) => a * b))
}
```

## Advanced: disabledCallback (reactive disable/hide)
```ts
{
  controlType: ControlType.INPUT,
  controlName: 'myField',
  label: 'Conditionally Disabled',
  hideDisabled: true,   // hide instead of just disable
  disabledCallback: (group: FormGroup) =>
    group.get('enabler').valueChanges.pipe(map(val => val !== 'enable'))
}
```
For multiple triggers, use `combineLatest` in the callback.

## Adding a custom field type
1. `ng g c <name> --project=crispr-forms`
2. Create `libs/crispr-forms/src/lib/utils/models/<name>.config.ts` extending `CrisprControlConfig`
3. Add to `ControlType` enum and `AnyFieldConfig` union in `crispr-field.config.ts`
4. Map in `libs/crispr-forms/src/lib/field-component-map.const.ts`, lazily via `import()`
5. Export the component from `src/lib/ui/public-api.ts` as a type only (`export type { ... }`). Field components must not be value exports of the entry point, or Rollup inlines the lazy chunks and the optional packages (`@angular/google-maps`, `browser-image-compression`, `@angular/material-date-fns-adapter`) end up in the main bundle. The `no-restricted-syntax` override in `libs/crispr-forms/.eslintrc.json` guards this: add the new field folder to its list
6. Give every `<button>` in the new field's template an explicit `type` (see "Buttons in templates")

## Buttons in templates
Every `<button>` in the library's templates, inline templates included, must set `type` explicitly. A button without a `type` is a submit button, so inside `<crispr-form>` a click submits the whole form: `submitted` and `invalidSubmit` fire, the invalid-fields snack bar opens, every field shows its errors, and an app that feeds the submitted value back into the form can lose text typed right afterwards.
- Use `type="button"` for anything that must not submit: edit, delete, add, clear, select, toggles and menu triggers.
- Use `type="submit"` only when the button is meant to submit, as the `BUTTON` field's submit type and the form's hidden submit trigger do.
- `src/lib/button-types.spec.ts` scans every template under `libs/crispr-forms/src` and fails with `file:line` for any button without a `type`, `[type]` or `[attr.type]`. If it fails, fix the template, do not weaken the scanner.

## Export skill
`libs/crispr-forms/export-skill/` contains the published skill docs:
- `SKILL.md` — feature narrative, usage examples, guidelines
- `models.md` — TypeScript interfaces for all field configs

**Whenever a new feature or field config property is added to this library, update both files** to reflect the change: add or extend the relevant interface in `models.md` and add a usage example / explanation in `SKILL.md`.

## Key files
- `libs/crispr-forms/src/lib/utils/models/crispr-field.config.ts` — FormConfig, ControlType, base interfaces
- `libs/crispr-forms/src/lib/utils/models/` — per-field config interfaces
- `libs/crispr-forms/src/lib/ui/` — individual field components
- `libs/crispr-forms/src/lib/field-component-map.const.ts` — ControlType → component mapping
- `apps/documentation/src/app/crispr-forms-demo/fields/` — field usage examples
- `apps/documentation/src/app/crispr-forms-demo/features/` — advanced feature examples (computed, disabled, validators)
