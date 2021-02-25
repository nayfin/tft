# CRISPR Forms
### Build forms like DNA builds life
<a href="https://www.npmjs.com/package/@tft/interact">
  <img alt="npm latest version" src="https://img.shields.io/npm/v/@tft/interact/latest.svg">
</a>


[Interactive docs](https://stackblitz.com/github/nayfin/tft-documentation)

## VOTE ON POSSIBLE BREAKING CHANGE

I'd like to implement modeled form configurations, which would allow users to get compilation errors when a form configuration will create a form value that is outside of the desired model.

For instance, let's say we want to create a form configuration that would generate a form who's value matches a simple model:

```ts
interface SimpleModel {
  a: string;
  b: string;
}
```

The form config would look something like this:

```ts
const formConfig: FormConfig = {
  ...
  fields: [
    {
      controlName: 'a',
      controlType: ControlType.INPUT,
    },
    {
      controlName: 'b',
      controlType: ControlType.INPUT
    },
  ]
}
```

Ideally, I would like to enable passing the model to the config as a generic to enforce `controlName`s alignment with property key names.

```ts

const formConfig: FormConfig<SimpleModel> = {
  ...
  fields: [
    {
      controlName: 'a',
      controlType: ControlType.INPUT,
    },
    {
      controlName: 'b',
      controlType: ControlType.INPUT,
    },
    {
      controlName: 'invalidControlName',  // <-- this would throw a compilation error
      controlType: ControlType.INPUT,
    },
  ]
}
```

This change would be very easy if I had initially made the `fields` property a mapped object of fields instead of an array, but it may be impossible to accomplish in the current architecture. So if you have ideas on how this can be accomplished without the massive breaking change of converting the `fields` property to a mapped object, take a look at the open [stackoverflow question](https://stackoverflow.com/questions/66359127/strongly-type-form-generator-config-array).

If we can't get the desired behavior without changing the `fields` property, we will have to change the `fields` property from an array to an object, with the `controlName` as the key to each field config. The previous example would look like this:

```ts
const newFormConfig: FormConfig<SimpleModel> = {
  ...
  fields: {
    a: {
      controlType: ControlType.INPUT,
    },
    b: {
      controlType: ControlType.INPUT,
    }
  }
}
```

Let me know what you think in this [survey](https://docs.google.com/forms/d/e/1FAIpQLSehFV17thIy79mV63sHOJIcwG-iALr9AyltrCOAbCcaFm1syg/viewform?usp=sf_link). Is the breaking change worth it to get modeled configurations or would you prefer to not have to align your configurations with the new system?

# NEW FEATURES:

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


### Breaking changes v10 => v11

All fields deprecated in v10 have been removed

### Breaking changes v10.0.* => v10.1.0

In order to enable custom fields we had to tighten up the interfaces and organize our hierarchy. Unfortunately, this caused some breaking changes.Where possible, we deprecated old names, and throw a warning but some configurations that worked in previous versions will break in v10.1.0.
- We've tightened up the models for the field configurations. So, fields that could have been misconfigured before, will now throw an error.  e.g. before it was possible to have a `placeholder` property on a checkbox even though it wouldn't have anything to do. Just remove any properties that suddenly cause a compilation error.
- `ControlName` and `ControlType` are deprecated on the `FormGroup` config. They were the result of some mis-extended interfaces were never used. Please remove these properties from FormGroup configurations before v11.
```ts
someConfig: FormConfig = {
  controlType: ControlType.GROUP, // REMOVED: please remove
  controlName: 'someControlName', // REMOVED: please remove
  autocomplete: 'off',
  fields: [...]
}
```
- `ControlType.GROUP` is deprecated and has changed to `ControlType.SUB_GROUP`, will be removed in v11
```ts
controlType: ControlType.GROUP
```
should be:
```ts
controlType: ControlType.SUB_GROUP
```
- `reactiveOptions: boolean` is deprecated and unused please remove from configs by v11


## WARNING:

API is mostly stable, and there are no planned breaking changes. However, we are working on some new features so there is the possibility there could be minor changes to API. [Recent breaking changes](#breaking-changes).

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
## Upcoming

- Framework agnostic with Angular Elements
- More examples of how to change field layout
- The rest of the Angular Material fields:
  - Radio button
  - Slide toggle
  - Button toggle
