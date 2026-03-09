# form-validation-handler

Automatically displays validation error messages on Angular form controls. Also provides custom validators.

## Setup
```ts
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
// add to module imports
```

## How it works
- `[formControl]` / `[formControlName]` directives automatically show errors on blur or form submit.
- Errors display via `ControlErrorComponent` injected next to the control.
- Form submit is detected via `ControlErrorsFormDirective` placed on the `<form>` tag.
- Custom error placement: use `controlErrorContainer` directive to render errors elsewhere in the DOM.

## Default error messages
| Validator key        | Message |
|----------------------|---------|
| `required`           | This field is required |
| `email`              | Please enter a valid email address |
| `minlength`          | Minimum of N characters required, but you entered N |
| `maxlength`          | Maximum of N characters allowed, but you entered N |
| `min`                | The minimum allowed value is N, actual value is N |
| `max`                | The maximum allowed value is N, actual value is N |
| `pattern`            | {value} fails to match pattern {pattern} |
| `maxFileSize`        | Max file size N MB exceeded |
| `allowedExtension`   | Allowed extensions: [...], actual: {ext} |
| `someControlIsValid` | At least one of the following fields must be valid: [...] |
| `minArrayLength`     | You need at least N item(s) |

## Custom error dictionary
Pass an `ErrorDictionary` to override messages. Each key is a validator name, value is a function receiving the error object:
```ts
import { ErrorDictionary } from '@tft/form-validation-handler/utils';

const myErrors: ErrorDictionary = {
  required: () => 'Please fill this in',
  minlength: ({ requiredLength }) => `Need at least ${requiredLength} chars`,
};
```
Pass via `FormConfig.errorDictionary` in crispr-forms, or directly to `ControlErrorsFormDirective`.

## Custom validators

### someControlIsValid
Form-level validator: passes if at least one of the named controls is valid.
```ts
import { someControlIsValid } from '@tft/form-validation-handler/utils';

config: FormConfig = {
  validators: [someControlIsValid(['fieldA', 'fieldB', 'fieldC'])],
  fields: [ ... ]
};
```

### minArrayLength
Control-level validator for array values (e.g. chiplist, multi-select):
```ts
import { minArrayLength } from '@tft/form-validation-handler/utils';

{ validators: [minArrayLength(2)] }
```

## Key files
- `libs/form-validation-handler/src/lib/form-errors.ts` — default error messages + `ErrorDictionary` / `ErrorFactory` types
- `libs/form-validation-handler/src/lib/directives/control-errors.directive.ts` — core auto-error directive
- `libs/form-validation-handler/src/lib/directives/control-error-container.directive.ts` — custom error placement
- `libs/form-validation-handler/src/lib/directives/control-errors-form.directive.ts` — form submit detection
- `libs/form-validation-handler/src/lib/validators/` — `someControlIsValid`, `minArrayLength`
