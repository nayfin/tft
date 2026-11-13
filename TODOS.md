# TODOS
- untangle crispr-forms' field-based dependencies (google maps, date-fns adapter, image compression) when we upgrade Angular — breaking change, see `libs/crispr-forms/TODOS.md`
- interact lasso: the selection box doesn't show the expected size when `scale` changes (`lasso.directive.ts`)
- enable configuring  inputType:number input fields convert number input strings to number types 

- "hidden" fields still take a flex slots
- how can skills changes automated for consumers 
- strictly typed forms
- apps/documentation, apps/api, mat-instantsearch and ui-imports still have broken generator-stub Jest specs and are not run in CI (the CI unit test step covers crispr-forms, form-validation-handler, interact, core and interact-testing only)
- interact ui tests — see `docs/plans/interact-showplaceholder-transform-bug.md`
- add a package smoke test to CI: import each built testing package from a Playwright spec outside the workspace, so a packaging break (like the ESM/extensionless one fixed in 6acd241) fails a PR
- CI: e2e compiles the docs app three times (production build, then a dev server per suite). Serve the production build statically for both suites instead
- CI: upgrade Playwright (1.58.2 cannot install Chromium on Ubuntu 26.04), then move `ci.yml` back from `ubuntu-24.04` to `ubuntu-latest`

## DOone
- Convert everything to standalone components
- Convert to signals (plus zoneless and strictTemplates)
- Adds e2e identifiers
- autccomplete chiplists aren't deletable
