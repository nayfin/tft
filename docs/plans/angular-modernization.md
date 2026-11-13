# Angular modernization plan

Angular 21.1, Nx 22.5. One PR per phase. Each phase: implementer → review → one code review. Verify with the production builds of the published libs and docs app, plus the full Playwright e2e suite (Jest is broken; see `libs/crispr-forms/TODOS.md`).

## Decisions
- **Published NgModules** (`CrisprFormsModule`, `CrisprPipesModule`, `SubGroupModule`, `FormValidationHandlerModule`, `InteractModule`) stay, marked `@deprecated`. They only import and export the standalone pieces, so nothing breaks; remove them in the next major. Each `@deprecated` message must say so and name the replacement, e.g. `@deprecated Import the standalone pieces (CrisprFormComponent, …) directly. This module will be removed in the next major version.`
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
Goal: a Playwright suite that proves interact works, so phases 1–3 can show they didn't break it. Readouts are rendered through template bindings on purpose, so a missed change detection under zoneless fails a test.

**Feature pages.** These are docs pages for consumers that the tests also drive. Nothing in their names or paths mentions e2e. The existing demos are a poor test base: shuffleboard uses inertia, landscaping pinch-zooms, and the preview page loads an external image.

Add pages under `interact-demo/features/` and link each from the docs nav. Each page has:
- a short explanation of the feature and the inputs and outputs it uses;
- a live example;
- a live readout of the last event, position and size.

The examples must stay deterministic: no inertia, no external assets, fixed starting positions. They carry `data-testid`s, so the copy can change without breaking tests.

Pages:
- `drag/basics`: drag within a dropzone; drag only from a handle (`allowFrom`); a `dragDisabled` toggle.
- `drag/dropzones`: move an item between two dropzones, with an event log of `dragEnter`, `dragLeave` and `dragDrop` and each zone's data.
- `drag/placeholder-template` (existing): replace the external image with a local asset, and compare `showPlaceholder` on and off.
- `resize/basics`: a resizable box with a size readout and a `resizeDisabled` toggle.
- `scale/basics`: drag inside `tftDragRoot tftAccountForScale tftApplyScale` with a scale control, starting at 1.5, to show the scale maths.

**Specs** (in `apps/interact-e2e`):
- Drag within a dropzone moves the element by the pointer delta, and the position persists after drop.
- Drop into a second dropzone fires `dragEnter`, `dragDrop` (with that zone's data) and, on the first zone, `dragLeave`.
- Without `showPlaceholder`, the source is hidden while dragging. With it, the source stays visible.
- The preview template appears in the drag root during the drag and is removed after it.
- `allowFrom` means a drag from outside the handle does nothing. `dragDisabled` means no movement.
- Resizing from the right, bottom and corner edges changes the size by the pointer delta. `resizeDisabled` means no change.
- Under scale 1.5, a 150px pointer move reports a 100-unit position change.
- The drag root doesn't fire a click after a drop.

**Helpers** (`libs/interact-testing`, shaped to publish as `@tft/interact-testing`):
- Pure geometry: `centerOf(box)`, `pointIn(box, {x, y})` (fractions or edge offsets), `offset(point, dx, dy)`, `boxDelta(before, after)`, and `edgePoint(box, edge, inset)` for resize handles.
- Pointer actions built on those, using `page.mouse` with steps (`dragTo()` doesn't reliably trigger interactjs):
  - `pointerDrag(page, from, to, opts)`, which crosses the drag threshold first.
  - `dragBy(page, locator, dx, dy)`.
  - `dragOnto(page, source, dropzone, opts)`, which aims at a point inside the dropzone because interact's default overlap is `pointer`.
  - `resizeBy(page, locator, edge, dx, dy)`.
- A README covering the drag gotchas: start inside a `user-select: none` element, aim at the dropzone's own element, and debug with `--headed`.
- Build it like `crispr-forms-testing` (tsc, with `package.json` and README copied to `dist`). Add it to `EXCLUDED` in `release.yml` until it has been published once by hand and has a trusted publisher.

**`apps/interact-e2e`.** A Playwright project that mirrors `crispr-forms-e2e`. It serves the docs app on port 3201, so both suites can run at once. Lint uses `@nx/eslint:lint`.

**CI.** Add `.github/workflows/ci.yml`, which runs on pull requests to `main`:
- `npm ci`, then install the Playwright Chromium browser;
- production builds of the published libs and the docs app;
- `crispr-forms-e2e` and `interact-e2e`.

The Cypress `documentation-e2e` project stays out of CI. The long-term goal is Playwright only.

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
