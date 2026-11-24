# form-validation-handler

Interactive documentation can be found on Stackblitz [here](https://stackblitz.com/github/nayfin/tft-documentation).

## Usage

All directives and the error component are standalone. Import the ones you need into your component:

```ts
import {
  ControlErrorsDirective,
  ControlErrorsFormDirective,
  ControlErrorContainerDirective,
} from '@tft/form-validation-handler';

@Component({
  imports: [ReactiveFormsModule, ControlErrorsDirective, ControlErrorsFormDirective, ControlErrorContainerDirective],
  // ...
})
export class MyFormComponent {}
```

## Building a message yourself

`getErrorMessage` returns the message the directive would show for a control's errors, for example to list errors outside the form. It uses the first error only, your `dictionary` wins over the default messages, and it returns `null` when there are no errors.

```ts
import { getErrorMessage } from '@tft/form-validation-handler';

getErrorMessage(control.errors); // 'This field is required'
getErrorMessage(control.errors, { required: () => 'Please fill this in' }); // 'Please fill this in'
```

> `FormValidationHandlerModule` is deprecated. It only re-exports the standalone pieces and will be removed in the next major version.