# @tft/mat-instantsearch

Angular Material UI components for Algolia InstantSearch.

> **Note:** The module is currently commented out due to a build error with `lodash-es` / `angular-instantsearch`. Check `mat-instantsearch.module.ts` before relying on this lib.

## Install
```bash
ng add @angular/material
npm i --save angular-instantsearch @tft/mat-instantsearch lodash-es
```

In `polyfills.ts`:
```ts
(window as any).process = { env: { DEBUG: undefined } };
```

In your module:
```ts
import { NgAisModule } from 'angular-instantsearch';
import { MatInstantsearchModule } from '@tft/mat-instantsearch';

imports: [
  MatInstantsearchModule,
  NgAisModule.forRoot(),
]
```

## Components
- `SearchBoxComponent` — Material search input wired to Algolia
- `FilterSelectComponent` — Mat select for Algolia refinement list
- `FilterChiplistComponent` — Chip list showing active filters
- `AutocompleteComponent` — Autocomplete suggestions from Algolia
- `PaginationComponent` — Paginator for Algolia results
- `AlgoliaAttributionComponent` — Required Algolia attribution badge

## Search config pattern
```ts
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch('APP_ID', 'SEARCH_ONLY_API_KEY');

export const SEARCH_CONFIG = {
  indexName: 'my_index',
  searchClient,
};
```

## Key files
- `libs/mat-instantsearch/src/lib/` — component source (search-box, filter-select, filter-chiplist, autocomplete, pagination, algolia-attribution)
- `libs/mat-instantsearch/src/lib/mat-instantsearch.module.ts` — module (currently commented out)
- `apps/documentation/src/app/mat-instantsearch-demo/search.config.ts` — example Algolia config
