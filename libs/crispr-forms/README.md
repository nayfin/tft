# crispr-forms

**Build complex forms dynamically from a configuration object.**

CRISPR Forms is an Angular library that allows you to build forms by providing a configuration object. This abstracts the template work, allowing you to focus on business logic. It is built on top of Angular Material.

[Interactive Docs](https://stackblitz.com/github/nayfin/tft-documentation)

## Architecture Overview

At its core, CRISPR Forms is a component that dynamically generates form fields based on a configuration you provide.

- **`<crispr-form>` component:** The main component you'll use. You pass it a `FormConfig` object, and it renders the form.
- **`FormConfig`:** A configuration object that defines the entire form, including its fields, validation, and behavior.
- **Field Components:** The library includes a variety of pre-built field components for different types of inputs (e.g., text input, select, datepicker). These are located in `libs/crispr-forms/src/lib/ui`.
- **Dynamic Field Generation:** A directive (`field.directive.ts`) and a component map (`field-component-map.const.ts`) work together to dynamically instantiate the correct field component based on the `controlType` specified in the field's configuration.

## Key Concepts

- **`FormConfig`:** The main configuration object for the entire form. It contains an array of `FieldConfig` objects.
- **`FieldConfig`:** A base interface for all field configurations. Each field type extends this with its own specific options. These configuration interfaces are located in `libs/crispr-forms/src/lib/utils/models`.
- **`ControlType`:** An enum that specifies the type of field to render (e.g., `ControlType.INPUT`, `ControlType.SELECT`).

## Installation

CRISPR Forms requires Angular Material.

Install the package and its peer dependency:

```bash
npm install @tft/crispr-forms @tft/form-validation-handler
```

Add Angular Material:

```bash
ng add @angular/material
```

The datepicker field requires `date-fns`:

```bash
npm i date-fns @angular/material-date-fns-adapter
```

You also need to provide `MAT_DATE_LOCALE` in your root module:

```ts
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';

@NgModule({
  // ...
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: enUS,
    },
  ],
})
export class AppModule {}
```

## Usage

Provide a `FormConfig` object to the `<crispr-form>` component.

**In your component's template:**

```html
<crispr-form [config]="config" (submitted)="handleSubmit($event)"></crispr-form>
```

**In your component's class:**

```ts
import { Component } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
})
export class MyFormComponent {
  config: FormConfig = {
    fields: [
      {
        controlType: ControlType.INPUT,
        controlName: 'name',
        label: 'Name',
        validators: [Validators.required],
      },
      {
        controlType: ControlType.SELECT,
        controlName: 'role',
        label: 'Role',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
      },
    ],
  };

  handleSubmit(event: any) {
    console.log(event);
  }
}
```

## Supported Fields

The following field types are supported:

- Autocomplete
- Autocomplete Chiplist
- Button
- Checkbox
- Datepicker
- Divider
- File Upload
- Form Group List
- Heading
- Image Upload
- Input
- Map
- Radio Buttons
- Select
- Slider
- Sub Group
- Textarea
- Unit Conversion

## Creating a Custom Field

To create a new field type for CRISPR Forms, follow these steps:

1.  **Generate a new component:**

    ```bash
    ng g c <your-field-name> --project=crispr-forms
    ```

2.  **Define the configuration interface:**
    Create a new file `libs/crispr-forms/src/lib/utils/models/<your-field-name>.config.ts`. This file will define the configuration interface for your new field. It should extend the base `FieldConfig`.

    ```ts
    import { FieldConfig } from './crispr-field.config';

    export interface YourFieldConfig extends FieldConfig {
      // your custom properties here
    }
    ```

3.  **Update `crispr-field.config.ts`:**
    In `libs/crispr-forms/src/lib/utils/models/crispr-field.config.ts`:
    - Add your new config to the `AnyFieldConfig` type.
    - Add an entry to the `ControlType` enum.

4.  **Create the component:**
    Your new component should extend `CrisprControlComponent` and implement the necessary logic.

5.  **Map the component:**
    In `libs/crispr-forms/src/lib/field-component-map.const.ts`:
    - Add your new component class to the `FIELD_COMPONENTS` array and the `CrisprControlComponent` type.

## Advanced Features

- **Computed Values:** Field values can be calculated based on the values of other fields.
- **Dynamically Disabled Fields:** Fields can be disabled reactively based on the values of other fields.
- **Custom Components:** You can pass your own custom components to be rendered as fields.