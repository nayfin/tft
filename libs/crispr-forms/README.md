# CRISPR Forms

### Build forms like DNA builds life

## WARNING:

API is mostly stable, and there are no planned breaking changes. However, we are working on some new features (layout system!!!) so there is the possibility there could be minor changes to API.

## Description

Web development tends to involve building a lot of forms, and even though it can be repetitive it's not necessarily easy. Connecting templates to `FormGroup`s takes time and there are a lot of opportunities  to make mistakes along the way that can difficult to debug. Large form are difficult to keep organized, and long form templates are cumbersome to update.

Luckily, we've abstracted out the template work entirely, allowing the end developer to simply pass a `config` of instructions to the `tft-crispr-forms` component and generate the form dynamically. This allows the end developer to focus on the business logic and not the template details.

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

If you want drag support for mat-slider and mat-slide-toggle you'll have to provide `HAMMER_GESTURE_CONFIG` in your root app module like this:
```typescript
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig } from '@angular/material';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
  ],
  // Add HAMMER_GESTURE_CONFIG here
  providers: [
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
Next, you'll need our sister library `npm i --save @tft/form-validation-handler` this enables automatic error handling of invalid fields. There are default messages for all the built in Angular validators, but they can easily overwritten by setting the `errorDictionary` field on the `config` input.

## Usage

With CRISPR Forms we've abstracted out form template entirely allowing you to generate your form by simply passing a configuration object to the `tft-crispr-form` component.

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

Better docs are in the works but for now you can check out this [example](https://stackblitz.com/edit/crisper-forms-poc) on StackBlitz of basic usage. We will be expanding on this to give clear examples of usage for each available field and feature in the near future.

## Upcoming

- Framework agnostic with Angular Elements
- Better documentation
- Static Layout for fields in forms
- Responsive Layout for fields in forms
- The rest of the Angular Material fields:
  - Radio button
  - Slide toggle
