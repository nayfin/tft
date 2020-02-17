# mat-instantsearch

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test mat-instantsearch` to execute the unit tests.
## Setup

in `polyfills.ts` add
```ts
// Algolia Search Library
(window as any).process = {
  env: { DEBUG: undefined },
};
```


```ts
import { UiImportsModule } from '@tft/ui-imports';
import { NgAisModule } from 'angular-instantsearch';
import { MatInstantsearchModule } from '@tft/mat-instantsearch';

  imports: [
    UiImportsModule,
    MatInstantsearchModule,
    NgAisModule.forRoot(),
  ]
```