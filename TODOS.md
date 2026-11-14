# TODOS

- "hidden" fields still take a flex slots
- how can skills changes be automated for consumers?
  - use the google tools to make publicly available (good for resume)
- strictly typed forms
  - would switching to signal forms enable?
- apps/documentation, apps/api, api-interfaces, mat-instantsearch and ui-imports still have broken generator-stub Jest specs and are excluded from the CI unit test step (`--exclude` in `ci.yml`; remove each from the list once fixed)
- remove unused projects (core, ui-imports, mat-instasearch)
- Jest specs aren't type-checked: the spec tsconfigs use `isolatedModules`, so ts-jest only transpiles. Add a `tsc -p tsconfig.spec.json --noEmit` typecheck target and run it in CI
- most rewritten Jest specs only check "creates" and "renders the label"; add behaviour tests (draggable/resizable registration, field value/validation wiring), and unit tests for `ControlErrorsDirective` / `ControlErrorContainerDirective` (their old specs were fully commented out and deleted)
- jsdom logs NG0303 "Can't bind to 'spellcheck'/'autocapitalize'/'autocomplete'" in the input-field and form specs, which would hide a real unknown-binding error. Shim the properties in test-setup, then fail tests on unexpected `console.error`
- interact lasso demo: at scale 2 in em mode the stage (480em = 960px) overflows the page column
- interact ui tests — see `docs/plans/interact-showplaceholder-transform-bug.md`
- add a package smoke test to CI: import each built testing package from a Playwright spec outside the workspace, so a packaging break (like the ESM/extensionless one fixed in 6acd241) fails a PR
- CI: e2e compiles the docs app three times (production build, then a dev server per suite). Serve the production build statically for both suites instead
- CI: upgrade Playwright (1.58.2 cannot install Chromium on Ubuntu 26.04), then move `ci.yml` back from `ubuntu-24.04` to `ubuntu-latest`

## Done
- Convert everything to standalone components
- Convert to signals (plus zoneless and strictTemplates)
- interact lasso rect wrong size at scale ≠ 1: README/skill bound it in `.px`, the directive needs `.em`; covered by `interact-e2e` lasso specs
- Adds e2e identifiers
- autccomplete chiplists aren't deletable
