# Fix: tftDraggable transform accumulation with showPlaceholder=true

## Context

When `[showPlaceholder]="true"` is set on a `[tftDraggable]` element, the original element stays visible during drag while a clone (`previewRef`) is moved around. The interactable is registered by ID (`interactableId`) on the original element. During `dragstart`, `updatePosition` is called on `previewRef` (correctly). However, interactjs also fires position updates against the registered interactable ID — which resolves back to the original element via the `position$` pipeline in `InteractService.setElementTransform`, setting `left`/`top` on it. After `dragend`, `display` is restored but the accumulated `left`/`top` values are not reset. On next render the element is displaced far from its natural layout position.

**Repro:** Set `[showPlaceholder]="true"` on any `[tftDraggable]`. After drag, log `el.nativeElement.getBoundingClientRect()` — x will be a large negative or positive value.

---

## Root cause (confirmed)

In `interact.service.ts`, `setElementTransform` writes `left` and `top` inline styles directly to whatever `position.targetElement` is. During `dragstart`, the `previewRef` is positioned at the clone's initial location — but the service's `position$` BehaviorSubject still has the original element as its `targetElement` from the initial `alignPositionWithInputs` call in `ngOnInit`. As deltas accumulate during `dragmove`, they're added to the position and written to `targetElement` — potentially the original element if the targetElement reference wasn't properly swapped to the preview.

At `dragend`, `display` is restored but `left`/`top` are not reset. The fix is to reset `left` and `top` on `el.nativeElement` at dragend.

---

## Plan

### Step 1 — Fix: reset original element position at dragend
**File:** `libs/interact/src/lib/directives/draggable.directive.ts`

In the `dragend` handler, after `this.renderer.setStyle(this.el.nativeElement, 'display', '')`, add:

```typescript
// Reset any accumulated left/top on the original element when using a preview clone
if (this.el.nativeElement !== this.previewRef) {
  this.renderer.setStyle(this.el.nativeElement, 'left', '');
  this.renderer.setStyle(this.el.nativeElement, 'top', '');
}
```

This only runs when a preview clone was used (i.e. `showPlaceholder=true` or a `tftDragPreview` template), leaving the normal drag path untouched.

---

### Step 2 — Create interact-demo E2E app

Model after `apps/crispr-forms-e2e`. Create:

**`apps/interact-demo-e2e/playwright.config.ts`**
- Same base config as crispr-forms-e2e
- `baseURL: http://localhost:3200`
- `testDir: ./src/specs`
- `webServer: npx nx serve documentation`

**`apps/interact-demo-e2e/project.json`**
- executor: `@nx/playwright:playwright`
- `implicitDependencies: ["documentation"]`

**`apps/interact-demo-e2e/tsconfig.e2e.json`**
- Copy from crispr-forms-e2e

**`apps/interact-demo-e2e/src/specs/landscaping.spec.ts`** — tests:
1. Page loads at `/interact-demo/landscaping`
2. Inventory items are visible
3. Can drag an inventory item to the yard dropzone (drag from `.drag-origin-content section[tftDraggable]` to `.drop-container`)
4. **Regression test — transform reset:** After drag completes, verify the dragged element's `left` and `top` inline styles are empty/reset (not accumulated values)
5. Can drag the same item again without displacement (drag a second time — verifies the fix holds across repeated drags)

---

### Step 3 — Run verification
```bash
npx nx build crispr-forms --configuration=production
npx nx run interact-demo-e2e:e2e --reporter=list
```

---

## Critical files
- `libs/interact/src/lib/directives/draggable.directive.ts` — dragend handler (~line 249)
- `libs/interact/src/lib/services/interact.service.ts` — `setElementTransform` (line 188) — read-only reference
- `apps/interact-demo-e2e/` — new directory to create
- `apps/documentation/src/app/interact-demo/landscaping/containers/inventory-list/inventory-list.component.html` — repro location (`[showPlaceholder]="true"`)

## Key selectors for tests
- Inventory draggable: `section[tftDraggable]` inside `.drag-origin-content`
- Yard dropzone: `.drop-container` inside `tft-section`
- Drag handle: `.handle` inside the draggable (dragConfig uses `allowFrom: '.handle'`)
