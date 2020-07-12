# CRISPR Forms
### Build forms like DNA builds life
<a href="https://www.npmjs.com/package/@tft/interact">
  <img alt="npm latest version" src="https://img.shields.io/npm/v/@tft/interact/latest.svg">
</a>


[Interactive docs](https://stackblitz.com/github/nayfin/tft-documentation)

## Major Breaking changes v10.0.* => v10.1.0
Apologies
We are working toward enabling custom field controls and had to tighten up some of our models and naming conventions. Where it was possible we deprecated old names, and throw a warning but some configurations that worked in previous versions will break in v10.1.0.
- Using FormGroup Config for SubGroups or itemConfig property of GroupListConfig
- ControlName and ControlType are deprecated on FormGroup Config, will be removed in v11

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

### <a name="breaking-changes"></a> Breaking change 8.4.0 -> 9.0.0

While adding the Material Autocomplete chiplist field to the library, we cleaned up the autocomplete field API and enabled dynamically switching the autocomplete options based on other field's values (e.g. a select field could control what http endpoint was called by the autocomplete field). Now with both autocomplete fields we require a callback function for the `options` field. This function always passes the parent form group and search string as arguments. We've removed the `reactiveOptionsCallback` field from select and autocomplete fields. Now when options are a callback function, we always pass the parent form group as the first argument you can use it or not as suits your needs.
#### New API
```typescript
{
  controlName: 'someControl',
  controlType: ControlType.AUTOCOMPLETE,
  options: (_form: FormGroup, searchTerm: string) => {
    // filter an array using the search term
    return ['some', 'demo', 'autocomplete', 'options']
      .filter(option => option.includes(searchTerm))
      .map(option => { label: option, value: option });
    // or make an http request based on it
    return this.http.get(`some/endpoint?query=${searchTerm}`).pipe(
      .map((res: {id: string, name: string}[]) => {
        return res.map(val => { label: val.name, value: val.id })
      })
  }
  ...
}
```
#### Old API

You used to be able to just return an array of options and we would perform a basic search on them. Now you have to write the filtering logic, but this is better suited for http based searching, and custom filtering.

## Upcoming

- Framework agnostic with Angular Elements
- Static Layout for fields in forms
- Responsive Layout for fields in forms
- The rest of the Angular Material fields:
  - Radio button
  - Slide toggle
  - Button toggle
