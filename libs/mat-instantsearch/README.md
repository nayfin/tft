# mat-instantsearch

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test mat-instantsearch` to execute the unit tests.

Better docs are coming!
We had to remove the examples from our stackblitz playground because of a build error that occurs when depending on lodash-es or angular-instantsearch. Hopefully they can get it fixed soon.

<!-- Find StackBlitz examples app [here](https://stackblitz.com/github/nayfin/tft-documentation) -->

## Setup

`ng add @angular/material`

`npm i --save angular-instantsearch @tft/mat-instantsearch lodash-es`

in `polyfills.ts` add
```ts
// Algolia Search Library
(window as any).process = {
  env: { DEBUG: undefined },
};
```


```ts
import { NgAisModule } from 'angular-instantsearch';
import { MatInstantsearchModule } from '@tft/mat-instantsearch';

  imports: [
    MatInstantsearchModule,
    NgAisModule.forRoot(),
  ]
```