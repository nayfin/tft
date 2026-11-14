# TODOS

- how can skills changes be automated for consumers?
  - use the google tools to make publicly available (good for resume)
- strictly typed forms
  - would switching to signal forms enable?
- apps/documentation, apps/api, api-interfaces, mat-instantsearch and ui-imports still have broken generator-stub Jest specs and are excluded from the CI unit test step (`--exclude` in `ci.yml`; remove each from the list once fixed)
- remove unused projects (core, ui-imports, mat-instasearch)
- most rewritten Jest specs only check "creates" and "renders the label"; add behaviour tests (draggable/resizable registration, field value/validation wiring), and unit tests for `ControlErrorContainerDirective` (its old spec was fully commented out and deleted; `ControlErrorsDirective` has one now)
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
