# TODOS

## Sooner 
- untangle field-based dependencies (`@angular/google-maps`, `@angular/material-date-fns-adapter`, `browser-image-compression`) at the next Angular major upgrade, as a breaking change. ng-packagr inlines the lazy `import()`s in `field-component-map.const.ts`, so the published bundle imports all three statically and every consumer must install them. Plan: `@tft/crispr-forms/map` and `/image-upload` secondary entry points, a `provideCrisprFields({ map: () => import(...) })` registry so the app's own dynamic import keeps them lazy, the datepicker stops bundling the date-fns adapter (app provides a `DateAdapter`), and the three become optional peers
- file-upload and image-upload `writeValue` are no-ops, so `form.reset()` / `patchValue(null)` leave the old file or preview on screen; implement them
- map element tests
- enable triggering blur on unit-conversion field and trigger validators
- autocomplete new chip form should use cdk overlay setting to achieve styling



## Later
- improve `getError` e2e helper — currently scopes to `crispr-${fieldType}-field` host which requires knowing the field type; explore using `getMatFormField` pattern instead
- switch `getError` selector from `p.tft-control-error` back to `tft-control-error` if the dual-input pattern in autocomplete/chiplist is ever refactored away
