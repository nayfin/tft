---
name: angular-modernization
description: Modernizes Angular components and directives to use signal-based inputs (input()/output()), removes ChangeDetectorRef, and ensures all components are standalone. Use when asked to modernize, migrate inputs to signals, or prepare for zoneless.
---

# Angular Modernization Skill

Invoke this skill when asked to:
- Migrate `@Input()` / `@Output()` decorators to signal-based `input()` / `output()`
- Remove `ChangeDetectorRef`
- Make components standalone
- Prepare a codebase for zoneless change detection

---

## Step 0 — Run the Angular CLI migrations first

**Use the official schematics wherever one exists, and only hand-migrate what they don't cover.** They handle edge cases (inheritance, template references, inputs written from outside) that manual edits miss. The patterns below are for cleaning up after them and for the cases they skip or report.

This is an Nx workspace with no `angular.json`, so run them through Nx:

```bash
npx nx g @angular/core:<migration> --path=<directory> --dry-run   # inspect first
npx nx g @angular/core:<migration> --path=<directory>
```

Run them in this order, one directory or project at a time. Commit after each so a bad run is easy to revert.

| # | Migration | What it does |
|---|---|---|
| 1 | `standalone-migration` | NgModule declarations → standalone. Use `--mode=convert-to-standalone`. **Do not use `prune-ng-modules` on published libs**: their NgModules are public API and stay as `@deprecated` wrappers until the next major. Use `standalone-bootstrap` only for apps. |
| 2 | `control-flow-migration` | `*ngIf` / `*ngFor` / `*ngSwitch` → `@if` / `@for` / `@switch` |
| 3 | `signal-input-migration` | `@Input()` → `input()` |
| 4 | `output-migration` | `@Output()` + `EventEmitter` → `output()` |
| 5 | `signal-queries-migration` | `@ViewChild` / `@ContentChild` (and `-Children`) → `viewChild()` / `contentChild()` |
| 6 | `inject-migration` | constructor injection → `inject()` (already done in this repo) |
| 7 | `route-lazy-loading-migration` | eager route components → `loadComponent` (apps only) |
| 8 | `self-closing-tags-migration` | `<x></x>` → `<x />` |
| 9 | `cleanup-unused-imports` | removes unused standalone `imports` entries |

Gotchas:
- **The signal migrations analyse every tsconfig in the workspace, whatever `--path` says.** A dry run of `signal-input-migration` on `libs/core` took ~16 minutes. Run them in the background with output redirected to a file, and prefer one run with a wider `--path` over many narrow ones. `--path` only limits which files get written. Verified: the dry run reported `Migrated 3/3 inputs` and listed only files under `libs/core`.
- **A clean dry run is not proof.** Check it against a file you know contains the pattern before trusting "no changes".
- **Migrations skip what they can't prove safe** (e.g. inputs that are written to, or read through a getter), and print the reason. Use the patterns below for those, or leave them and note why.
- **After each migration**, run the production builds of the published libs and the docs app, then the e2e suite. Template type errors only show up in the build.

---

## Pattern 1 — Simple `@Input()` property → `input<T>()`

```typescript
// BEFORE
import { Input } from '@angular/core';
@Input() label: string;
@Input() disabled = false;

// AFTER
import { input } from '@angular/core';
label = input<string>();
disabled = input(false);          // default inferred as boolean
```

Use `input.required<T>()` when there is no sensible default and the value is always expected:
```typescript
option = input.required<SelectOption>();
```

Update the import list — remove `Input`, add `input`.

---

## Pattern 2 — `@Input()` setter that writes to a `signal()` → `input()` or `input() + computed()`

This pattern appears in base/abstract classes that need to merge defaults or transform the incoming value.

**Simple case — no transformation needed:**
```typescript
// BEFORE
@Input({alias: 'group'}) set inputGroup(g: FormGroup) { this.group.set(g); }
group = signal<FormGroup>(null);

// AFTER
group = input<FormGroup>(null);   // signal is now readonly from outside, reactive inside
```

**With default merging (e.g. config + defaultConfig):**
```typescript
// BEFORE
@Input({alias: 'config'}) set inputConfig(c: C) {
  this.config.set(this.defaultConfig ? { ...this.defaultConfig, ...c } : c);
}
config = signal<C | null>(null);

// AFTER
inputConfig = input<C | null>(null, { alias: 'config' });
config = computed<C | null>(() => {
  const c = this.inputConfig();
  return c && this.defaultConfig ? { ...this.defaultConfig, ...c } : c;
});
```
`config` becomes a readonly `Signal` (not writable). Ensure no subclass calls `this.config.set()`.

Remove `Input`, `signal` from imports; add `input`, `computed`.

---

## Pattern 3 — Dynamic component creation: use `setInput()` not `.signal.set()`

When a directive creates components dynamically via `ViewContainerRef.createComponent()`, it must use `componentRef.setInput()` to set inputs — never reach into the instance and call `.set()` on a signal directly. With `input()`, signals on instances are readonly.

```typescript
// BEFORE — BREAKS with input() signals
this.component = componentRef.instance;
this.component.value.set(someValue);       // ❌ input() signals are readonly

// AFTER — always use setInput()
private componentRef: ComponentRef<MyComponent>;
// ...
this.componentRef = componentRef;
this.component = componentRef.instance;
this.componentRef.setInput('value', someValue);  // ✅
```

For reactive updates after init, use `effect()`:
```typescript
constructor() {
  effect(() => {
    if (this.componentRef) {
      this.componentRef.setInput('value', this.value());
    }
  });
}
```

---

## Pattern 4 — `@Output() EventEmitter` → `output<T>()`

```typescript
// BEFORE
import { Output, EventEmitter } from '@angular/core';
@Output() submitted = new EventEmitter<FormGroup>();
// emit:
this.submitted.emit(this.form);

// AFTER
import { output } from '@angular/core';
submitted = output<FormGroup>();
// emit (identical):
this.submitted.emit(this.form);
```

**Special case — `@Output()` backed by an Observable** (non-standard but sometimes used):
```typescript
// BEFORE
@Output() valueChanges: Observable<any> = this.form.valueChanges;

// AFTER — use outputFromObservable
import { outputFromObservable } from '@angular/core/rxjs-interop';
valueChanges = outputFromObservable(toObservable(this.form).pipe(
  switchMap(f => f.valueChanges)
));
```

---

## Pattern 5 — Remove `ChangeDetectorRef`

### When it's safe to remove entirely
After converting to `input()` signals, Angular's reactivity system detects changes automatically on OnPush components. These usages are typically removable:
- `cdr.detectChanges()` called after `setInput()` on a dynamically created component
- `cdr.detectChanges()` called after writing to a writable signal

```typescript
// BEFORE
this.component.value.set(v);
this.cdr.detectChanges();

// AFTER (with setInput())
this.componentRef.setInput('value', v);
// no detectChanges needed
```

### When to replace with `markForCheck()` instead of removing
Keep (or downgrade to `markForCheck()`) when:
- An async operation runs **outside the Angular zone** (e.g. third-party library callbacks, Web Workers, native browser events attached manually)
- The component has `ChangeDetectionStrategy.OnPush` and state changes happen in a non-signal, non-async-pipe path

```typescript
// BEFORE
this.cdr.detectChanges();

// AFTER (async/outside-zone case)
this.cdr.markForCheck();
```

Full removal of `ChangeDetectorRef` is safe once zoneless is enabled — `markForCheck()` is a no-op in zoneless.

---

## Pattern 6 — Ensure `standalone: true`

In Angular 17 and below, `standalone` defaults to `false`. In Angular 19+, it defaults to `true`. For a **published library**, always be explicit:

```typescript
@Component({
  selector: 'my-component',
  standalone: true,           // explicit — don't rely on defaults
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

For a component that was `standalone: false` and declared in an NgModule:
1. Add `standalone: true`
2. Remove it from the `declarations` array of its NgModule
3. Add it to the `imports` array of any NgModule or standalone component that uses it

---

## Zoneless Preparation Checklist

Do these **before** enabling `provideZonelessChangeDetection()` (stable since Angular 20; the old name `provideExperimentalZonelessChangeDetection` is gone):

- [ ] All components use `ChangeDetectionStrategy.OnPush`
- [ ] All inputs are `input()` signals (not `@Input()` with manual `markForCheck`)
- [ ] All state mutations go through signals, `async` pipe, or Observables with `async` pipe
- [ ] No `setTimeout`/`setInterval` used to trigger CD (replace with `signal()` or `rxjs` timer)
- [ ] `ChangeDetectorRef.detectChanges()` removed or replaced with `markForCheck()`
- [ ] E2E and unit test coverage is sufficient to catch missed CD triggers
- [ ] Remove `zone.js` from the app's polyfills after enabling (in this repo: `apps/documentation/src/polyfills.ts`, referenced from `apps/documentation/project.json`)

**Enable zoneless:**
```typescript
// app.config.ts or main.ts
import { provideZonelessChangeDetection } from '@angular/core';
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    // remove provideZoneChangeDetection() if present
  ]
});
```

---

## Pattern 7 — Update templates to call signals with `()`

Angular's **runtime** auto-unboxes signals in templates, but the **template type checker** does not. After converting `@Input()` properties to `input()` signals, any template expression that accesses a property on the signal (`config.classes`, `info.content`, etc.) will produce a TS2339 compile error like:

```
Property 'classes' does not exist on type 'InputSignal<FormConfig>'.
```

**Fix:** add `()` to every signal reference in every template that uses the converted input.

```html
<!-- BEFORE -->
[ngClass]="config.classes"
@if (config.heading) {
{{ info.content }}
{{ option.label }}

<!-- AFTER -->
[ngClass]="config().classes"
@if (config().heading) {
{{ info().content }}
{{ option().label }}
```

**Scope:** affects `.html` template files only — `.ts` files already require `()` to call signals and will have been updated during the TypeScript conversion. Run a build (`ng build` or `nx build`) after the TypeScript pass to surface all remaining template errors at once.

---

## Pattern 8 — Avoid getters over signals; use local `const` instead

Getters that call signals (`get formArray() { return this.control() as FormArray }`) are called repeatedly by Angular's change detection and template evaluation, defeating the batching benefits of signals. Prefer a local `const` at the top of each method:

```typescript
// AVOID
get formArray(): FormArray {
  return this.control() as FormArray;
}
addGroup() { this.formArray.push(...); }
deleteGroup(i) { this.formArray.removeAt(i); }

// PREFER
addGroup() {
  const formArray = this.control() as FormArray;
  formArray.push(...);
}
deleteGroup(i: number) {
  const formArray = this.control() as FormArray;
  formArray.removeAt(i);
}
```

This also applies to any other signal-reading getter used in templates — move the call into the template expression directly (e.g. `(control() | async)`) rather than wrapping it in a getter.

---

## Common Gotchas

1. **`input()` signals are readonly** — external code cannot call `.set()` on them. Use `setInput()` for dynamic components.
2. **`computed()` vs `signal()`** — if you need to write to a value from multiple places, keep it as `signal()`. Only use `computed()` for derived/transformed values.
3. **`effect()` timing** — effects run after the component is initialized. For dynamic components, guard with a null check on `componentRef`.
4. **Template references** — templates using `[config]="x"` with an `input({alias: 'config'})` continue to work unchanged.
5. **`input.required()`** — causes a runtime error if the parent doesn't provide the input. Only use for inputs that are truly always required.
6. **Library consumers** — if publishing a library, `input()` and `output()` are fully backward-compatible with template bindings (`[foo]="bar"` and `(foo)="handler($event)"`). No breaking changes.
