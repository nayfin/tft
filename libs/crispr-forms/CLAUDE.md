# crispr-forms

Config-driven Angular Material form builder. Provide a `FormConfig` object → get a fully rendered, validated form.

## Import
```ts
import { FormConfig, ControlType } from '@tft/crispr-forms';
```
Add `CrisprFormsModule` to your module's `imports`.

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
  fields: [ ...fieldConfigs ]
};
```

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
{ controlType: ControlType.DATEPICKER, controlName: 'dob', label: 'Date of Birth' }
```
Requires: `date-fns`, `@angular/material-date-fns-adapter`, and `MAT_DATE_LOCALE` provider in root module.

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
4. Map in `libs/crispr-forms/src/lib/field-component-map.const.ts`

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
