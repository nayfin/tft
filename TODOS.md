# TODOS
- can we make google maps install only required if the field is used?
- "hidden" fields still take a flex slots
- how can skills changes automated for consumers 
- strictly typed forms
- enable configuring  inputType:number input fields convert number input strings to number types 
- interact ui tests — see `docs/plans/interact-showplaceholder-transform-bug.md`
- add a package smoke test to CI: import each built testing package from a Playwright spec outside the workspace, so a packaging break (like the ESM/extensionless one fixed in 6acd241) fails a PR
- CI: e2e compiles the docs app three times (production build, then a dev server per suite). Serve the production build statically for both suites instead
- CI: upgrade Playwright (1.58.2 cannot install Chromium on Ubuntu 26.04), then move `ci.yml` back from `ubuntu-24.04` to `ubuntu-latest`

## DOone
- Convert everything to standalone components
- Convert to signals (plus zoneless and strictTemplates)
- Adds e2e identifiers
- autccomplete chiplists aren't deletable
