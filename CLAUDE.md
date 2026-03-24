# TFT Monorepo

## Verification

Run these steps after completing any feature or non-trivial change. Do not ask the user — just run them in order and fix any failures before considering the work done.

**1. Build**
```bash
npx nx build crispr-forms --configuration=production
```
Catches type errors and compilation failures fast. Fix before proceeding.

**2. E2E**
```bash
npx nx run crispr-forms-e2e:e2e --reporter=list
```
Runs the full Playwright suite. Fix any failures or flag them to the user if the failure is pre-existing and unrelated to the current change.
