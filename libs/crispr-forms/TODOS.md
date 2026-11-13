# TODOS

## Sooner 
- untangle field-based dependencies (`@angular/google-maps`, `@angular/material-date-fns-adapter`, `browser-image-compression`) at the next Angular major upgrade, as a breaking change. ng-packagr inlines the lazy `import()`s in `field-component-map.const.ts`, so the published bundle imports all three statically and every consumer must install them. Plan: `@tft/crispr-forms/map` and `/image-upload` secondary entry points, a `provideCrisprFields({ map: () => import(...) })` registry so the app's own dynamic import keeps them lazy, the datepicker stops bundling the date-fns adapter (app provides a `DateAdapter`), and the three become optional peers
- enable configuring  inputType:number input fields convert number input strings to number types 
- Enable passing location search configuration to map field
- map element tests
- enable triggering blur on unit-conversion field and trigger validators
- autocomplete new chip form should use cdk overlay setting to achieve styling



## Later
- improve `getError` e2e helper — currently scopes to `crispr-${fieldType}-field` host which requires knowing the field type; explore using `getMatFormField` pattern instead
- switch `getError` selector from `p.tft-control-error` back to `tft-control-error` if the dual-input pattern in autocomplete/chiplist is ever refactored away
- OnPush field templates (input, select, textarea, file-upload) read `control().valid`/`touched` non-reactively, so a parent `patchValue` or async validation doesn't refresh the hint/error state. Expose a status signal from `control.events` once in `CrisprControlComponent` (image-upload already does this) and use it in every field
- form-group-list template: `last && selectedIndex() ?? true` parses as `(last && selectedIndex()) ?? true`, so selectedIndex 0 hides the last item. Decide the intent and parenthesise
- form-validation-handler: `errorDictionary` is read once in the `ControlErrorsDirective` constructor, so a late-bound or changed dictionary is ignored. Make `errors` a `computed()`
