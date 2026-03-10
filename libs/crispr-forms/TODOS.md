# TODOS

## Sooner 
- map element tests
- enable triggering blur on unit-conversion field and trigger validators
- convert all NgModule-based components/directives/pipes to standalone components (deprecate and support both?)

- migrate from `fullTemplateTypeCheck` to `strictTemplates` (found several real bugs when attempted)

## Later
- improve `getError` e2e helper — currently scopes to `crispr-${fieldType}-field` host which requires knowing the field type; explore using `getMatFormField` pattern instead
- switch `getError` selector from `p.tft-control-error` back to `tft-control-error` if the dual-input pattern in autocomplete/chiplist is ever refactored away