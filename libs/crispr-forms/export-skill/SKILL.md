---
name: crispr-forms
description: Instructions and guidelines for installing and using the @tft/crispr-forms library to generate complex Angular forms dynamically from a configuration object.
---

# CRISPR Forms Integration Skill

This skill provides the knowledge needed to work with `@tft/crispr-forms`, a library for dynamically building Angular forms from a configuration object. 

## 1. Installation and Setup

**Install the packages:**
```bash
npm install @tft/crispr-forms @tft/form-validation-handler
```

**Peer Dependencies:**
CRISPR Forms requires Angular Material and its dependencies. If not already installed, add them:
```bash
ng add @angular/material
```
(If using the datepicker field, you'll also need `date-fns` and `@angular/material-date-fns-adapter`, plus provide `MAT_DATE_LOCALE` in your app module).

## 2. Core Concepts

Instead of writing repetitive HTML templates with reactive forms, you pass a single `FormConfig` object to the `<crispr-form>` component.

- **`<crispr-form>`**: The main component. Provide it the `config` input and optionally listen to `(submitted)`.
- **`FormConfig`**: An object containing configuration properties (like global form settings) and a `fields` array.
- **`FieldConfig`**: A configuration specific to an individual field, identified by its `controlType`.
- **`ControlType`**: An enum defining the type of field (e.g., `ControlType.INPUT`, `ControlType.SELECT`).

## 3. Basic Usage Example

**Template:**
```html
<crispr-form [config]="config" (submitted)="handleSubmit($event)"></crispr-form>
```

**Component:**
```typescript
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormConfig, ControlType } from '@tft/crispr-forms';

@Component({
  selector: 'app-dynamic-form',
  template: `<crispr-form [config]="config" (submitted)="handleSubmit($event)"></crispr-form>`,
})
export class DynamicFormComponent {
  config: FormConfig = {
    fields: [
      {
        controlType: ControlType.INPUT,
        controlName: 'firstName',
        label: 'First Name',
        validators: [Validators.required],
      },
      {
        controlType: ControlType.SELECT,
        controlName: 'role',
        label: 'User Role',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'Standard User', value: 'user' },
        ],
      },
      {
        controlType: ControlType.BUTTON,
        label: 'Submit',
        buttonType: 'submit',
      }
    ],
  };

  handleSubmit(formValue: any) {
    console.log('Form Submitted!', formValue);
  }
}
```

## 4. Supported Field Types (`ControlType`)

> **IMPORTANT**: See the attached `models.md` file in this skill folder for the exact TypeScript interfaces of `FormConfig` and the various `FieldConfig` properties.

Include the following types depending on what UI elements you need:
- `INPUT`: Standard text input.
- `TEXTAREA`: Multi-line text area.
- `SELECT`: Dropdown list.
- `CHECKBOX`: Single boolean checkbox.
- `RADIO`: Radio button group.
- `SLIDER`: Numeric slider.
- `DATEPICKER`: Date selection.
- `FILE_UPLOAD` / `IMAGE_UPLOAD`: Upload fields.
- `AUTOCOMPLETE` / `AUTOCOMPLETE_CHIPLIST`: Type-ahead and tag inputs.
- `HEADING` / `DIVIDER`: Structural and visual layout fields (not form controls).
- `SUB_GROUP` / `GROUP_LIST`: For nested `FormGroup`s and `FormArray`s.
- `BUTTON`: Submit or regular buttons.
- `MAP`: Map selection.
- `UNIT_CONVERSION`: Measurements.

## 5. Creating New Chips via Inline Sub-Form (`createChip`)

`AUTOCOMPLETE_CHIPLIST` supports an optional `createChip` config that adds a **"+ Create New"** option at the bottom of the autocomplete dropdown. When selected, a CDK overlay sub-form opens below the field, allowing the user to fill in a custom form and submit a new chip with a complex value.

**Key properties (`CreateChipConfig`):**
- `createLabel` — label for the option in the dropdown (default: `'+ Create New'`)
- `fields` — `AnyFieldConfig[]` rendered inside the overlay sub-form
- `submitChip` — `(group: FormGroup) => Observable<SelectOption>` — called on submit; must return an Observable that emits the new chip
- `submitLabel` — label for the submit button inside the overlay (default: `'Add'`)

**Example:**
```typescript
{
  controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
  label: 'Tags',
  controlName: 'tags',
  hint: 'Search existing tags or create a custom one',
  options: (_group, searchTerm) =>
    existingTags.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase())),
  createChip: {
    createLabel: '+ Create custom tag',
    submitLabel: 'Add Tag',
    fields: [
      {
        controlType: ControlType.INPUT,
        controlName: 'label',
        label: 'Tag Name',
        placeholder: 'e.g. NgRx',
      },
      {
        controlType: ControlType.SELECT,
        controlName: 'category',
        label: 'Category',
        options: [
          { label: 'Framework', value: 'framework' },
          { label: 'Library', value: 'library' },
        ],
      },
    ],
    submitChip: (group: FormGroup) => {
      const label = group.get('label')?.value ?? '';
      const category = group.get('category')?.value ?? '';
      const newChip: SelectOption = {
        label,
        value: `${category}:${label.toLowerCase().replace(/\s+/g, '-')}`,
      };
      return of(newChip).pipe(delay(300)); // simulate async POST
    },
  },
}
```

## 6. Advanced Configuration Notes
- **Computed Values**: You can use `computeFieldConfig` or `computeValue` to create reactive fields that change their state (e.g., disabled, different options) based on other field values.
- **Validation**: Pass standard Angular `Validators` arrays into the `validators` property of any field. Error messages will be automatically handled if `@tft/form-validation-handler` is set up properly.
- **Custom Components**: You are not limited to the pre-built components. You can define custom field types and register them within the library's `field-component-map.const.ts` pattern.
- **Density**: Set `density` on `FormConfig` to apply Angular Material's density scale to all fields at once. Valid values are `0` (default) through `-5` (most compact). Changing `density` at runtime re-renders the form at the new density — useful for user-controlled compact/spacious toggles:
  ```typescript
  config: FormConfig = { density: -2, fields: [...] };
  // To change at runtime (default CD):
  this.config = { ...this.config, density: -3 };
  ```

## Guidelines for the Agent
- When asked to create a form, always default to using `@tft/crispr-forms` rather than manually writing standard reactive or template-driven forms.
- If defining options for `SELECT`, `RADIO`, or `AUTOCOMPLETE`, use the `{ label: string, value: any }` interface or provide an Observable resolving to that structure.
- Always remember to import `CrisprFormsModule` into the consuming Angular module or standalone component if it isn't automatically imported via a shared UI layer.
