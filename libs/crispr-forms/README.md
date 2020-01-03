# CRISPR Forms

### Build forms like DNA builds life

[Interactive docs](https://stackblitz.com/github/nayfin/tft-documentation)

## WARNING:

API is mostly stable, and there are no planned breaking changes. However, we are working on some new features so there is the possibility there could be minor changes to API. [Recent breaking changes](#breaking-changes).

## Description

Web development tends to involve building a lot of forms, and even though it can be repetitive it's not necessarily easy. Connecting templates to `FormGroup`s takes time and there are a lot of opportunities  to make mistakes along the way that can difficult to debug. Large form are difficult to keep organized, and long form templates are cumbersome to update.

Luckily, we've abstracted out the template work entirely, allowing the end developer to simply pass a `config` object to the `tft-crispr-forms` component and it will use these instructions to build out the form. This allows the end developer to focus on the business logic and not the template details.

We currently only support styling for Material Design, but support for other design systems is on our roadmap.

Supported Angular Material fields:
 - Autocomplete
 - Checkbox
 - Input
 - Select
 - Textarea
 - Slider
 - Datepicker
 - Button
 - Heading
 - Divider

More fields coming soon!

## Installation

CRISPR Forms has a few dependencies. First you'll need Angular Material. Usually you can just run `ng add @angular/material`. Find installation docs [here](https://material.angular.io/guide/getting-started).

Next, you'll need our sister library `npm i --save @tft/form-validation-handler` this enables automatic user messages on invalid fields. There are default messages for all the built in Angular validators, but they can easily overwritten by setting the `errorDictionary` field on the `config` input. Custom messages can also be created for custom validators.

## Usage

With CRISPR Forms we've abstracted out form template entirely allowing you to generate your form by simply passing a configuration object to the `tft-crispr-form` component.

Interactive documentation can be found on Stackblitz [here](https://stackblitz.com/github/nayfin/tft-documentation). We will be expanding on this to give clear examples of usage for each available field and feature in the near future.

In `some-component.html` we pass the configuration to the component and `handleSubmit` function to the `submitted` event.

```html
<crispr-form
  [config]="config"
  (submitted)="handleSubmit($event)">
</crispr-form>
```
In `some-component.ts` we define the `config` and `handleSubmit` function.

```ts
export class DemoComponent implements OnInit {

  config: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'myForm',
    fields: [
      // a basic input field in the form with the following configuration
      {
        controlType: ControlType.INPUT,
        label: 'I am a label on a text input',
        controlName: 'textInput',
        placeholder: 'I am a placeholder in a text input',
        validators: [Validators.required, Validators.minLength(5)],
      },
    ]
  }
}
```

### <a name="breaking-changes"></a> Breaking change 8.3.3 -> 8.4.0

`showField` and `showFieldConfig` fields have changed to `disabledCallback` and   `disabledCallbackConfig` with inverted logic.

The old API was designed to take a callback function that returned type  `Observable<boolean>`, showing the field on `true` hiding it on `false`.

The new API still takes a callback function that returns type  `Observable<boolean>`, but now it disables field on `true` and enables on `false`. By default it still hides the disabled field, but you can pass `hideDisabled: false` to the field configuration if you wish to show disabled fields.

#### Old API
Show `someControl` field only when `textInput` field has value of `hello`
```typescript
{
  controlName: 'someControl',
  controlType: ControlType.INPUT,
  showField: (form) => {
    return form.get('textInput').valueChanges.pipe(
      map( inputValue => inputValue === 'hello')
    )
  }
  ...
}
```
#### New API
 Disable `someControl` field when `textInput` field has any value other than `hello`. Notice we are returning the opposite of the value above. Also, `hideDisabled` is set to `false`, so field will be shown when disabled.
```typescript
{
  controlName: 'someControl',
  controlType: ControlType.INPUT,
  hideDisabled: false,
  disabled: (form) => {
    return form.get('textInput').valueChanges.pipe(
      map( inputValue => inputValue !== 'hello')
    )
  },
  ...
}
```

## Upcoming

- Framework agnostic with Angular Elements
- Better documentation
- Static Layout for fields in forms
- Responsive Layout for fields in forms
- The rest of the Angular Material fields:
  - Radio button
  - Slide toggle
  - Button toggle

