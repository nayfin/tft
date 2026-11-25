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

You also need to provide `MAT_DATE_LOCALE` in your application providers:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: enUS,
    },
  ],
});
```

## Standalone imports

Everything in the library is standalone. Import the pieces you need directly into your component:

```ts
import { Component } from '@angular/core';
import { CrisprFormComponent } from '@tft/crispr-forms';

@Component({
  selector: 'app-my-form',
  imports: [CrisprFormComponent],
  templateUrl: './my-form.component.html',
})
export class MyFormComponent {}
```

> `CrisprFormsModule` and `CrisprPipesModule` are deprecated. They only re-export the standalone pieces and will be removed in the next major version.

> The field components (`InputFieldComponent`, `SelectFieldComponent`, and so on), `FormGroupListComponent` and `SubGroupComponent` are loaded lazily by `<crispr-form>` and are not importable from the package entry point (the field components and `FormGroupListComponent` are exported as types only). Use `CrisprFormComponent` and let it render them from your config.

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

## Test IDs

Control fields render a `data-testid` attribute derived from their `controlName` (prefixed by parent sub groups / list items, e.g. `address.city`, `contacts[0].name`). Buttons have no `controlName`, so they only render one when you set the optional `testId` on any field config:

```ts
{ controlType: ControlType.BUTTON, label: 'SAVE', testId: 'save-button' }
```

`testId` overrides the `controlName`-derived id; a parent group prefix is still applied (`testId: 'save'` inside sub group `actions` renders `actions.save`).

## Image Upload Field

`ControlType.IMAGE_UPLOAD` lets users pick, preview and optionally compress an image before it is set as the control value (a `File`).

```ts
{
  controlType: ControlType.IMAGE_UPLOAD,
  controlName: 'photo',
  label: 'Photo',
  acceptedTypes: 'image/*',
  compressImage: true,
  targetCompressedImageFileSizeMb: 0.4,
  // called on every processing state change, validity is already up to date
  processingStateChange: (state, group) => console.log(state, group.status),
  // called with the final processed File once it has been set as the control value
  filesChanged: (group, file) => console.log(file.name),
}
```

### Processing state

The component exposes a `processingState` signal (`ImageProcessingState`: `'idle' | 'processing' | 'failed'`):

- `processing`: a selected image is being compressed. A "Compressing: <name>" indicator is shown, the control is cleared and **the form is invalid** with the `imageProcessing` error until processing finishes. Previously a form could be submitted mid-compression.
- `failed`: compression threw (e.g. a corrupt file). The control stays `null`, a failure message is shown and the control is invalid with the `imageProcessingFailed` error (`{ message }`). Selecting another image, clearing or resetting the field recovers it. A failure no longer breaks the field for later selections.
- `idle`: nothing is being processed.

Selecting another image, clearing or resetting while an image is compressing cancels the superseded compression (it never reports `failed`). If the field is destroyed mid-processing, the in-flight compression is cancelled, the processing error is removed from the control and `processingStateChange` reports `idle`.

`processingStateChange?: (state, parentGroup) => void` fires on every transition. The control's validity is updated before it is called, so `parentGroup.status` already reflects the new state. `filesChanged?: (parentGroup, file) => void` (previously declared but never called) now fires with the final processed `File`.

Default messages for the new `imageProcessing` and `imageProcessingFailed` error keys live in `defaultErrors` and can be overridden through the form's `errorDictionary`. The processing error comes before the field's other validators, so a required image shows "Please wait while the image is processed" while it compresses, and the failure message after a failure, rather than "This field is required". After a clear, `required` shows again.

### Compression timeout

`compressionTimeoutMs` (default `30000`, `0` disables) is how long a selected image may take to process. When it is exceeded the compression is aborted and the field goes to `failed` with `Compressing "<name>" took too long. Please try again or choose a smaller image.`, under the same `imageProcessingFailed` error key. A late result of the aborted compression is ignored, and the user can select another image.

### Following all image fields from the form

`<crispr-form>` exposes the aggregate of all its image fields (sub-groups and group list items included) as a `processingState` signal, `'idle' | 'processing' | 'failed'`, and a `processingStateChange` output that emits when it changes (not for the initial `'idle'`). A form without image fields is `'idle'`. This replaces wiring a `processingStateChange` callback into every image field's config to, for example, disable a Save button outside the form:

```html
<crispr-form #form [config]="config" />
<button [disabled]="form.processingState() !== 'idle'" (click)="save()">Save</button>
```

`submitted` is not blocked while an image is processing, so check the state yourself if the submit button is inside the form. For forms built without `<crispr-form>`, `getProcessingState(group)` returns the same aggregate.

## Datepicker Field

Set `clearable: true` on a `DATEPICKER` field to let users remove a date they picked. A small text button (no icon) appears next to the calendar toggle while the control has a value and is enabled. Clicking it sets the value to `null` and marks the control dirty and touched, so a required field shows its required error straight away.

```ts
{
  controlType: ControlType.DATEPICKER,
  controlName: 'startDate',
  label: 'Start date',
  clearable: true,
  clearButtonLabel: 'Remove start date', // optional, the button's visible text. Defaults to 'Clear'
}
```

### Custom footer actions

`datepickerActions` takes a component that is rendered in the calendar's footer, for example Cancel and Select buttons. The component must be standalone and import the Material directives its buttons use. A `matDatepickerCancel` or `matDatepickerApply` attribute does nothing unless the component imports `MatDatepickerCancel` or `MatDatepickerApply` from `@angular/material/datepicker`.

```ts
@Component({
  selector: 'app-datepicker-footer',
  template: `
    <button mat-button matDatepickerCancel>Cancel</button>
    <button mat-raised-button matDatepickerApply>Select</button>
  `,
  imports: [MatButton, MatDatepickerCancel, MatDatepickerApply],
})
export class DatepickerFooterComponent {}

// in the field config
{ controlType: ControlType.DATEPICKER, controlName: 'startDate', datepickerActions: DatepickerFooterComponent }
```

## File Upload Field

`ControlType.FILE_UPLOAD`'s `filesChanged?: (parentGroup, files) => void` (previously declared but never called) now fires with the selected or dropped `FileList` after it is set as the control value. The `uploadComponent` passed to `uploadFiles` keeps its `isUploaded` boolean; it is now signal-backed, so assigning it asynchronously (e.g. when an upload completes) re-renders the field without zone.js.

## Showing what is wrong when a form is submitted

Each field shows its own error once it is touched. To list everything that is wrong in one place, use `showInvalidErrors`, the `invalidFields` signal and the `invalidSubmit` output.

**Snack bar (opt-in).** With `showInvalidErrors`, an invalid submit (from the submit button or `triggerSubmit()`) opens one Angular Material snack bar. It has a "Fix N field(s) to continue" heading, lists the invalid fields as `label: message` and ends with a Dismiss button. It is off by default and never moves focus.

```ts
config: FormConfig = {
  showInvalidErrors: true, // the defaults
  // or adjust them:
  // showInvalidErrors: { duration: 0, maxErrors: 3, dismissLabel: 'Got it' },
  errorDictionary: { required: () => 'Required' },
  fields: [ /* ... */ ],
};
```

| `InvalidErrorsConfig` | Default | |
| --- | --- | --- |
| `duration` | `8000` | How long it stays open, in ms. `0` keeps it open until it is dismissed. |
| `maxErrors` | `5` | How many fields to list. The rest show as "+N more". |
| `dismissLabel` | `'Dismiss'` | The text of the button that closes it. |

Only one snack bar is open at a time: a second invalid submit replaces the first.

**`invalidFields` signal.** `<crispr-form>` exposes `invalidFields`, what is wrong right now, in config order, whether or not the fields have been touched. It updates as the user edits, and it keeps the same array reference while nothing observable has changed.

**`invalidSubmit` output.** Emits the same array when the form is submitted while invalid. `submitted` still fires for every submit, exactly as before.

```html
<crispr-form #form [config]="config" (invalidSubmit)="handleInvalidSubmit($event)" />

<ul>
  @for (field of form.invalidFields(); track field.path) {
    <li><strong>{{ field.label }}</strong>: {{ field.message }}</li>
  }
</ul>
```

```ts
import { InvalidField } from '@tft/crispr-forms';

handleInvalidSubmit(fields: InvalidField[]) {
  console.log(fields.map((field) => field.label));
}
```

Each `InvalidField` is `{ path, label, message, errorKey, control }`: the dot path of the control (`photos.1.caption`, empty for the whole form), a readable name, the error message, the first error key, and the control itself.

**How fields are listed**

- One entry per invalid field, using only its first error. The message comes from the form's `errorDictionary`, then the library defaults.
- A field is named by its `label`, else its `heading.label`, else its `controlName`.
- Sub-groups and group lists are named by their `heading.label`, or their `controlName`. Their invalid fields are named inside-out: `Street in Address`.
- Group list items use `itemLabelBuilder(index)` when set (the index is 0-based), otherwise `<list name> <position>`, so `Photo in Photos 2` or, with a builder returning `'Photo 2'`, `Photo in Photo 2`.
- A group's, list's, item's or the form's own validator error (for example `minArrayLength` on a list) is listed only when none of its fields are, named after the group (`Form` for the whole form).
- Disabled controls and config entries without a control (headings, dividers, buttons) are skipped.

The same logic is available as a plain function, `getInvalidFields(config, group, errorDictionary?)`, for forms you build without `<crispr-form>`.

## Recent changes

Consumer-facing changes from the last few releases. See [CHANGELOG.md](./CHANGELOG.md) for the per-version history.

### New config options

- **`valueAsNumber` on `INPUT`.** With `inputType: 'number'`, set `valueAsNumber: true` to get a `number` control value (an empty input gives `null`) instead of a string. It is off by default and has no effect on other input types. In this mode `maxLength` and `pattern` are not applied, since browsers ignore them on number inputs.
- **`clearable` and `clearButtonLabel` on `DATEPICKER`.** Adds a small text clear button to the datepicker; `clearButtonLabel` sets its visible text. See [Datepicker Field](#datepicker-field).
- **`testId` on any field config**, including buttons. See [Test IDs](#test-ids).
- **`processingState` and `processingStateChange` on `IMAGE_UPLOAD`.** See [Image Upload Field](#image-upload-field).
- **`compressionTimeoutMs` on `IMAGE_UPLOAD`, and `processingState` / `processingStateChange` on `<crispr-form>`.** A stalled compression fails after a timeout (default 30 s), and the form reports the state of all its image fields. See [Compression timeout](#compression-timeout) and [Following all image fields from the form](#following-all-image-fields-from-the-form).
- **`showInvalidErrors` on `FormConfig`, the `invalidFields` signal and the `invalidSubmit` output on `<crispr-form>`.** List what is wrong when a form is submitted, with an opt-in snack bar. `submitted` is unchanged. Requires `@tft/form-validation-handler` `^21.2.0`. See [Showing what is wrong when a form is submitted](#showing-what-is-wrong-when-a-form-is-submitted).

### Behaviour changes

- **`UNIT_CONVERSION` can store and load `null`.** `storedValueConversion` and `initialDisplayValueConversion` may now return `null`, and `initialDisplayValueConversion` receives the stored value unchanged. A stored `0` used to arrive as `null`; it now arrives as `0`, and only a missing value arrives as `null`. A conversion that treats a falsy `value` as "no measurement" (for example `value ? convert(value) : 0`) should check `value == null` instead. Return `null` from both conversions for an empty field to keep it `null` on load, so a `required` field starts invalid.
- **Seeded falsy values are kept.** An initial value of `0`, `false` or `''` is no longer turned into `null`. For example, a checkbox seeded with `false` now reports `false`, and `Validators.required` treats it as filled. Use `Validators.requiredTrue` for "must be ticked".
- **Forms are invalid while an image is processing.** A form containing an `IMAGE_UPLOAD` field is invalid during compression and after a compression failure, so buttons with `disabledOnInvalidForm` are disabled in that window.
- **Image processing times out after 30 seconds by default.** A compression that took longer now fails with a "took too long" message. Raise `compressionTimeoutMs`, or set it to `0`, for the old behaviour.
- **The image processing error comes before `required`.** A required image upload shows the processing message while compressing and the failure message after a failure, instead of "This field is required". Selecting a file also marks the control touched first, so the error shows at once on an untouched field.
- **`filesChanged` now fires** on `IMAGE_UPLOAD` and `FILE_UPLOAD`. It was declared before but never called, so existing callbacks will start running.

### Fixes

- **Form group list:**
  - Items now receive their initial values. Nested fields that read only the `value` input (such as `AUTOCOMPLETE_CHIPLIST`) used to start empty and fire their required validators.
  - With a `displayItemComponent`, only the selected item opens for editing (or the last one when nothing is selected). Adding an item opens the new one, and deleting an item keeps the selection correct.
- **Image upload:** a compression failure no longer breaks the field for later selections, and selecting a new image, clearing, resetting or destroying the field cancels the in-flight compression. The preview no longer replays a stale image.
- **`hideDisabled` fields** no longer keep their flex or grid slot, so there is no empty gap left behind.
- **Hints react to outside changes.** Hints on the input, select, textarea, file upload, autocomplete, chiplist, datepicker and unit conversion fields now update when the control is changed from outside the template (`markAsTouched`, `setErrors`, `patchValue`, async validators). `CrisprControlComponent` exposes `controlValid`, `controlTouched` and `hintVisible` signals for this.
- **`errorDictionary`** (`@tft/form-validation-handler`) is now reactive. A late-bound or changed dictionary is picked up, where before it was read once. `ControlErrorsDirective` also no longer throws when used outside a form.
- **Slider** `displayWith` falls back to the raw value when it is unset.
- **Map field:** the unused `onSelectLocation` handler is removed (the map was already recentred on the chosen location), and the `markers` callback receives the `GoogleMap` component on initialisation. The docs app has a new `searchAutocompleteRequest` example.

### Lazy loading restored (21.2.0)

- **Field components are lazy again.** 21.1.0 to 21.1.3 shipped one bundle that statically imported `@angular/google-maps`, `browser-image-compression` and `@angular/material-date-fns-adapter`. From 21.2.0 each field component is a lazy chunk again, so those packages are no longer part of the entry bundle.
- **Breaking: value exports removed.** The field components (`InputFieldComponent`, `SelectFieldComponent`, `MapFieldComponent`, `OptionComponent`, and so on) and `FormGroupListComponent` are exported from the entry point as types only (`ComponentRef<InputFieldComponent>` still type-checks, but you cannot add them to a component's `imports`). `SubGroupComponent` and `SubGroupModule` are no longer exported. Use `<crispr-form>` with a `FormConfig`, or build a custom field on `CrisprControlComponent` and `FieldContainerComponent`.

### Zoneless, standalone and signals (21.1.0)

- **Zoneless support.** The library works in zoneless apps (`provideZonelessChangeDetection()`) as well as zone-based ones. Components are `OnPush`-friendly and no longer rely on `ChangeDetectorRef` or zone.js.
- **Standalone everywhere.** All components, directives and pipes are standalone. The entry point exports `CrisprFormComponent`, `FieldContainerComponent`, the directives and pipes, and the file-upload, file-dropzone, selected-file, heading and info components. The other field components are loaded lazily and are exported as types only, so they cannot be imported as values (see [Lazy loading restored](#lazy-loading-restored-2120)). See [Standalone imports](#standalone-imports).
- **Deprecated modules.** `CrisprFormsModule` and `CrisprPipesModule` (and `FormValidationHandlerModule` in `@tft/form-validation-handler`) still work but will be removed in the next major version.
- **Signal-based inputs, outputs and queries.** Template bindings work as before. If you were using the library in unexpected ways you may have some breakages. You may want to ask yourself what posessed you to do these things in the first place:
  - Setting an input imperatively (`instance.foo = x`) must use `ComponentRef.setInput()`.
  - Outputs are `OutputEmitterRef`s: `.subscribe()` works, `.pipe()` does not. Use `outputToObservable()` if you need operators (for example `CrisprControlComponent.valueChanges`).
  - Some public fields are now signals: `FormGroupListComponent.blockValue` / `selectedIndex`, `SelectFieldComponent.allSelected`, `ImageUploadFieldComponent.progress`, and `ControlErrorComponent.text()` / `hide()`.
- **Peer dependencies corrected.** Angular (`common`, `core`, `forms`, `material`, `cdk`) is `^21.0.0` (it previously still said `^18.0.0`) and `@tft/form-validation-handler` is `^21.1.0`.

### Related packages

- **`@tft/crispr-forms-testing`:** consumers can import it again. A previous build failed with `Cannot find module .../helpers/form.helpers`. The README is rewritten for consumers and is now included in the published package.
- **`@tft/interact`:** `tftResizable` no longer computes `NaN` sizes without a `tftAccountForScale` ancestor, and `provideInteract()` replaces `InteractModule.forRoot()`. The lasso docs now bind `lassoDisplayRect` with `.em` rather than `.px`, so the box is drawn correctly at scales other than 1.

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