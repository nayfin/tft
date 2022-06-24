# CRISPR Forms
### Build forms like DNA builds life
<a href="https://www.npmjs.com/package/@tft/interact">
  <img alt="npm latest version" src="https://img.shields.io/npm/v/@tft/interact/latest.svg">
</a>


[Interactive docs](https://stackblitz.com/github/nayfin/tft-documentation)


## Description

Web development tends to involve building a lot of forms, and even though it can be repetitive it's not necessarily easy. Connecting templates to `FormGroup`s takes time and there are a lot of opportunities  to make mistakes along the way that can difficult to debug. Large form are difficult to keep organized, and long form templates are cumbersome to update.

Luckily, we've abstracted out the template work entirely, allowing the end developer to simply pass a `config` object to the `tft-crispr-forms` component and it will use these instructions to build out the form. This allows the end developer to focus on the business logic and not the template details.

We currently only support styling for Material Design, but support for other design systems is on our roadmap.

### Supported Angular Material fields:
  - Autocomplete
  - Autocomplete Chiplist
  - Checkbox
  - Input
  - Select
  - Textarea
  - Slider
  - Datepicker
  - Button
  - Heading
  - Divider

### More fields coming soon!

Super sweet features:
  - computed values: field values based on one or many other field values (fieldC === fieldA * fieldB)
  - dynamically disabled fields: disable a field reactively based on other field(s) values
  - configurations to handle all the features of each Angular Material field

## Installation

CRISPR Forms has a few dependencies. First you'll need Angular Material. Usually you can just run `ng add @angular/material`. Find installation docs [here](https://material.angular.io/guide/getting-started).

The datepicker field require `date-fns` and `@angular/material-date-fns-adapter` to be installed.
`npm i date-fns @angular/material-date-fns-adapter`

You will have also have to provide value for `MAT_DATE_LOCALE` in your root module.
```ts
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';


@NgModule({
  ...
  providers: [
    {
        provide: MAT_DATE_LOCALE,
        useValue: enUS,
    },
  ],
});
```

<!-- Next, you'll need our sister library `npm i --save @tft/form-validation-handler` this enables automatic user messages on invalid fields.  -->
There are default messages for all the built in Angular validators, but they can easily overwritten by setting the `errorDictionary` field on the `config` input. Custom messages can also be created for custom validators.

## Usage

With CRISPR Forms we've abstracted out form template entirely allowing you to generate your form by simply passing a configuration object to the `tft-crispr-form` component.

Interactive documentation can be found on Stackblitz [here](https://stackblitz.com/github/nayfin/tft-documentation), with editable examples for most features.

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
    fields: [
      // a basic input field in the form with the following configuration
      {
        controlType: ControlType.INPUT,
        label: 'I am a label on a text input',
        controlName: 'textInput',
        placeholder: 'I am a placeholder in a text input',
        validators: [Validators.required, Validators.minLength(5)],
      },
      {
        controlType: ControlType.SELECT,
        label: 'I am a label on a text input',
        controlName: 'textInput',
        options: [
          {label: 'option a', value: 'optionA'}
          {label: 'option a', value: 'optionA'}
        ],
        placeholder: 'I am a placeholder in a text input',
        validators: [Validators.required, Validators.minLength(5)],
      },
    ]
  }
}
```


## Buttons can reset form or take custom events

See example [here](https://stackblitz.com/github/nayfin/tft-documentation?file=src%2Fapp%2Fcrispr-forms-demo%2Ffields%2Fbutton%2Fbutton.component.ts).

## Datepicker can take a callback function to pass a class to specified fields

See example [here](https://stackblitz.com/github/nayfin/tft-documentation?file=src%2Fapp%2Fcrispr-forms-demo%2Ffields%2Fdatepicker%2Fdatepicker.component.ts). Be sure to check out the corresponding .scss file to see how we pass styles down to the cell class.

## Pass Custom Components to CRISPR

Simply create a component and pass it as an argument to the `component` property.

```ts
export class CustomComponentComponent {

  customComponentConfig: FormConfig<CustomInputConfig> = {
    autocomplete: 'off',
    fields: [
      {
        component: CustomInputComponent,
        controlType: ControlType.CUSTOM,
        controlName: 'customComponent',
      },

```
Examples of how to extend current field behavior available [here](https://stackblitz.com/github/nayfin/tft-documentation?file=src%2Fapp%2Fcrispr-forms-demo%2Ffeatures%2Finfo%2Finfo.component.ts0)

## Breaking Changest v13 => v14

### Switch from MomentDateAdaptor to FnsDateAdapter

With momentjs shifting into maintenance mode, it no longer makes sense to use the `MomentDateAdaptor`, so we've switched to the `FnsDateAdapter`. This means that for `DatepickerFieldConfig`s the `datepickerFilter`, `cellClassFunction`, `dateClass` properties, instances of `Moment` will need to be replaced with `Date`.

#### v13

```ts
  datepickerFilter?: (date: Moment) => boolean;
  cellClassFunction?: MatCalendarCellClassFunction<Moment>;
  dateClass?: (parentGroup: UntypedFormGroup) => Observable<MatCalendarCellClassFunction<Moment>>;
```

#### v14
```ts
  datepickerFilter?: (date: Date) => boolean;
  cellClassFunction?: MatCalendarCellClassFunction<Date>;
  dateClass?: (parentGroup: UntypedFormGroup) => Observable<MatCalendarCellClassFunction<Date>>;
```

You'll also have to set up a date locale in your root module. See [installation](#installation) for details on how to set up the new adaptor.



#### Upcoming / In Progress

- Creating modules for each component so that you can avoid importing unused components

- Framework agnostic with Angular Elements
- More examples of how to change field layout
- The rest of the Angular Material fields:
  - Radio button
  - Slide toggle
  - Button toggle
