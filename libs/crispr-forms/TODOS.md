# TODOS

## Sooner 
- Enable passing location search configuration to map field
- map element tests
- enable triggering blur on unit-conversion field and trigger validators
- autocomplete new chip form should use cdk overlay setting to achieve styling
- convert all NgModule-based components/directives/pipes to standalone components (deprecate and support both?)

- migrate from `fullTemplateTypeCheck` to `strictTemplates` (found several real bugs when attempted)
- fix Jest: `nx test crispr-forms` fails all 27 suites at load (esbuild "Buffer.from("") instanceof Uint8Array" invariant in the jsdom env), and most specs are broken generator stubs; CI doesn't run unit tests
  - once fixed, add unit tests for the pure geometry helpers in `libs/interact-testing/src/geometry.ts` and run unit tests in `.github/workflows/ci.yml`

## Later
- improve `getError` e2e helper — currently scopes to `crispr-${fieldType}-field` host which requires knowing the field type; explore using `getMatFormField` pattern instead
- switch `getError` selector from `p.tft-control-error` back to `tft-control-error` if the dual-input pattern in autocomplete/chiplist is ever refactored away