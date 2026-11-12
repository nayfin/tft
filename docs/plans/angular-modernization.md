# Angular modernization plan

Angular 21.1, Nx 22.5. One PR per phase. Each phase: implementer → review → one code review. Verify with the production builds of the published libs and docs app, plus the full Playwright e2e suite (Jest is broken; see `libs/crispr-forms/TODOS.md`).

## Decisions
- **Published NgModules** (`CrisprFormsModule`, `CrisprPipesModule`, `SubGroupModule`, `FormValidationHandlerModule`, `InteractModule`) stay, marked `@deprecated`. They only import and export the standalone pieces, so nothing breaks; remove them in the next major.
- **Scope.** Modernize `crispr-forms`, `form-validation-handler`, `interact`, `core` and the `documentation` app. Leave `mat-instantsearch` untouched.
- **interact** gets e2e coverage before it changes.
- **Zoneless, then `strictTemplates`**, each as its own phase.
- **Skill.** Keep the repo-local `angular-modernization` skill. Add the "CLI migrations first, in order" workflow from Bitwarden's skill, not their house rules.

## Baseline (2026-11-12, `main` at 0ef04c2)
- **Production builds pass:** `crispr-forms`, `form-validation-handler`, `interact`, `crispr-forms-testing`, `documentation`.
- **e2e:** 80 passed, 0 failed (~1 min).
- **`nx lint`** (all failures pre-existing; a phase must not add any):

  | Project | Errors | Warnings |
  |---|---|---|
  | `crispr-forms` | 8 | 39 |
  | `form-validation-handler` | 2 | 2 |
  | `interact` | 2 | 7 |
  | `core` | 3 | 0 |
  | `documentation` | 90 | 29 |

  `interact` and `core` were switched to `@nx/eslint:lint` in 0a so they can be measured.

## Phases

### 0a. Skill and baseline
- Update `.claude/skills/angular-modernization/SKILL.md`:
  - Run the CLI migrations in order: standalone, control-flow, signal-input, output, signal-queries, inject, self-closing-tag, unused-imports. First confirm whether `nx g @angular/core:<migration>` works in this workspace.
  - Use `provideZonelessChangeDetection` (v21), not the old experimental name.
- Record the baseline: e2e pass count, `nx lint` counts, and that all builds pass.

### 0b. interact e2e coverage
- Add an interact demo-backed Playwright suite covering drag, drop, resize and the drag preview, so later phases can prove interact still works.

### 1a. Standalone: libraries
- `crispr-forms`: make `InitialControlValuePipe` standalone. `CrisprPipesModule`, `SubGroupModule` and `CrisprFormsModule` become deprecated wrappers.
- `form-validation-handler`: make the 4 declarations standalone. `FormValidationHandlerModule` becomes a deprecated wrapper.
- `interact`: `InteractModule` becomes a deprecated wrapper.
- `core`: make the header and sidenav standalone.
- Run the control-flow and self-closing-tag migrations.

### 1b. Standalone: docs app
- Convert the 40 components and 25 modules to standalone.
- Bootstrap with `bootstrapApplication`, and lazy-load routes with `loadComponent`/`loadChildren`.

### 2. Signals
- CLI migrations for inputs, outputs and queries:
  - `crispr-forms`: 9 queries, 2 outputs, 1 input
  - `form-validation-handler`: 2 inputs
  - `core`: 3 inputs and 2 outputs
  - docs app: the rest
- `CrisprControlComponent.valueChanges`: `EventEmitter` → `output()`. Consumers calling `.pipe()` on it will break, so note it in the PR.
- Template-read mutable fields become signals, e.g. group-list's `blockValue` and `selectedIndex`.
- Remove `ChangeDetectorRef`: the `form-validation-handler` `detectChanges()` and the image upload `markForCheck()`.
- `divider` gets OnPush. Run the unused-imports migration.

### 3. Zoneless
- Replace the `setTimeout` change-detection workarounds:
  - `CrisprControlComponent.ngOnInit`
  - `select-field`
  - the chiplist panel
  - `interact`'s draggable
- Check that `interact`'s `NgZone.runOutsideAngular` still behaves without zone.js.
- Docs app: `provideZonelessChangeDetection()`, and drop `zone.js` from the polyfills.

### 4. strictTemplates
- Swap `fullTemplateTypeCheck` for `strictTemplates`, then fix what it finds.

## Consumer-facing notes (for release notes)
- Signal inputs break anyone who sets an input imperatively (`instance.foo = x`). Template bindings are unaffected.
- `output()` keeps `.subscribe()`, but has no RxJS operators.
- Deprecated NgModules keep working until the next major.
