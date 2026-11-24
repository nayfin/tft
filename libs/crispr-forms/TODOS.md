# TODOS

## Sooner 
- untangle field-based dependencies (`@angular/google-maps`, `@angular/material-date-fns-adapter`, `browser-image-compression`) at the next Angular major upgrade, as a breaking change. the lazy `import()`s in `field-component-map.const.ts` were being inlined into the main chunk from 21.1.0 to 21.1.3 (the entry barrel exported the field components as values; fixed in 21.2.0, guarded by a `no-restricted-syntax` lint override), so the three packages are no longer in the initial bundle. Consumers must probably still install them, because a bundler has to resolve the lazy chunks' imports at build time (inferred, not verified). Plan: `@tft/crispr-forms/map` and `/image-upload` secondary entry points, a `provideCrisprFields({ map: () => import(...) })` registry so the app's own dynamic import keeps them lazy, the datepicker stops bundling the date-fns adapter (app provides a `DateAdapter`), and the three become optional peers
- strictly typed forms
  - would switching to signal forms enable?
  - signal forms' `[formField]` reads number inputs natively (even with a bound `[type]`), which would make crispr-forms' `valueAsNumber` flag and its duplicated number `<input>` unnecessary
- file-upload and image-upload `writeValue` are no-ops, so `form.reset()` / `patchValue(null)` leave the old file or preview on screen; implement them
- map element tests
- enable triggering blur on unit-conversion field and trigger validators
- autocomplete new chip form should use cdk overlay setting to achieve styling
- convert to signal forms 


## Later
- improve `getError` e2e helper — currently scopes to `crispr-${fieldType}-field` host which requires knowing the field type; explore using `getMatFormField` pattern instead
- switch `getError` selector from `p.tft-control-error` back to `tft-control-error` if the dual-input pattern in autocomplete/chiplist is ever refactored away
