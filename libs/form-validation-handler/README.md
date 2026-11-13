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

> `FormValidationHandlerModule` is deprecated. It only re-exports the standalone pieces and will be removed in the next major version.