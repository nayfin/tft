---
name: tft-interact
description: Instructions and guidelines for installing and using the @tft/interact library to add drag, drop, resize, gesture, and lasso interactions to Angular applications using interactjs under the hood.
---

# @tft/interact Integration Skill

This skill provides the knowledge needed to work with `@tft/interact`, an Angular directive library wrapping [interactjs](https://interactjs.io/) for drag-and-drop, resize, gesture, auto-scroll, and lasso selection.

---

## 1. Installation and Setup

```bash
npm install @tft/interact interactjs
```

All directives are **standalone** — import them individually or use `InteractModule` for NgModule-based apps.

**Standalone (recommended):**
```typescript
import { DraggableDirective, DropzoneDirective, ResizableDirective } from '@tft/interact';

@Component({
  imports: [DraggableDirective, DropzoneDirective, ResizableDirective],
})
export class MyComponent {}
```

**NgModule (legacy):**
```typescript
import { InteractModule } from '@tft/interact';

@NgModule({
  imports: [InteractModule.forRoot({ cssDimensionUnit: 'px' })],
})
export class AppModule {}
```

> `InteractModule` is deprecated and will be removed in the next major version. Prefer importing directives directly.

---

## 2. Core Directives

| Directive | Selector | Purpose |
|---|---|---|
| `DraggableDirective` | `[tftDraggable]` | Makes an element draggable |
| `DropzoneDirective` | `[tftDropzone]` | Defines a drop target |
| `ResizableDirective` | `[tftResizable]` | Makes an element resizable |
| `GesturableDirective` | `[tftGesturable]` | Pinch/rotate gesture support |
| `DragRootDirective` | `[tftDragRoot]` | Sets where the drag clone is appended |
| `AccountForScaleDirective` | `[tftAccountForScale]` | Compensates coordinates for CSS `scale()` |
| `ApplyScaleDirective` | `[tftApplyScale]` | Applies a scale value as `font-size` (used with `em`-based layouts) |
| `AutoScrollDirective` | `[tftAutoScroll]` | Auto-scrolls a container during drag |
| `LassoDirective` | `[tftLasso]` | Drag-to-select rectangle on a canvas |
| `DragPreviewDirective` | `ng-template[tftDragPreview]` | Custom template for the drag clone |
| `ArrayOfNPipe` | `arrayOfN` | Pipe: creates an array of N items for `@for` |

---

## 3. Draggable

```html
<div tftDraggable
  [x]="item.x" [y]="item.y"
  [dragData]="item"
  [dragDisabled]="isLocked"
  (dragEnd)="onDragEnd($event)">
</div>
```

**Key inputs:**

| Input | Type | Default | Description |
|---|---|---|---|
| `x` | `number` | — | Initial x position |
| `y` | `number` | — | Initial y position |
| `dragData` | `D` | — | Payload attached to drag events |
| `dragDisabled` | `boolean` | `false` | Disables drag |
| `dragZIndex` | `number` | `10000` | z-index while dragging |
| `dragConfig` | `DraggableOptions` | — | Raw interactjs config (inertia, modifiers, etc.) |
| `showPlaceholder` | `boolean` | `false` | Keep original element visible while dragging |
| `dragRoot` | `DragRootDirective` | — | Override drag root element |
| `enableDragDefault` | `boolean` | `true` | Use built-in clone+position behaviour |

**Outputs:** `dragStart`, `dragMove`, `dragInertiaStart`, `dragEnd` — all emit `TftDragEvent`.

**Inertia + restrict example (shuffleboard-style):**
```typescript
dragConfig: DraggableOptions = {
  inertia: { resistance: 2, allowResume: true, endSpeed: 10, smoothEndDuration: 2000 },
  modifiers: [
    interact.modifiers.restrict({
      restriction: '.board',
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
    }),
  ],
};
```

---

## 4. Dropzone

```html
<div tftDropzone
  [dropzoneId]="'yard'"
  [dropzoneConfig]="{ overlap: 0.5 }"
  (dragDrop)="onDrop($event)"
  (dragEnter)="onEnter($event)"
  (dragLeave)="onLeave($event)">
</div>
```

**Key inputs:** `dropzoneId`, `dropzoneConfig` (`DropzoneOptions`), `dropzoneData`, `position` (CSS position, default `'relative'`).

**Outputs:** `dragDrop`, `dragEnter`, `dragLeave`, `dropActivate` — all emit `TftDropEvent`.

**Accessing dropzone ID in events:**
```typescript
// dropzoneId is now an input() signal — call it with ()
onDrop(event: TftDropEvent) {
  if (event.dropTarget?.dropzoneId() === 'yard') { ... }
}
```

---

## 5. Resizable

```html
<div tftResizable
  [width]="w" [height]="h"
  [resizeConfig]="{ edges: { right: true, bottom: true } }"
  (resizeEnd)="onResizeEnd($event)">
</div>
```

**Key inputs:** `width`, `height`, `resizeConfig` (`ResizableOptions`), `resizeDisabled`, `position`, `enableResizeDefault`.

**Outputs:** `resizeStart`, `resizeMove`, `resizeInertiaStart`, `resizeEnd` — all emit `TftResizeEvent`.

`TftResizeEvent` includes `size: { width, height }` and `positionInDropTarget`.

---

## 6. Scale Support

Use `tftAccountForScale` on the drag root when CSS `scale()` is applied. Both drag and resize directives read it automatically via `computed()`.

```html
<div tftDragRoot tftAccountForScale [scale]="scale">
  <div tftDraggable tftResizable [width]="w" [height]="h"></div>
</div>
```

For cross-dropzone scenarios where the draggable is not a child of the `tftDragRoot`:
```html
<div tftDragRoot tftAccountForScale [scale]="scale" #root="tftDragRoot">
  <div tftDropzone>
    <div tftDraggable [dragRoot]="root"></div>
  </div>
  <div tftDropzone (dragDrop)="onDrop($event)"></div>
</div>
```

---

## 7. Gesture (pinch-to-zoom)

```html
<div tftDragRoot tftGesturable tftAccountForScale
  [scale]="scale"
  [style.transform]="'scale(' + scale + ')'"
  [style.transform-origin]="transformOrigin"
  (gestureMove)="onGestureMove($event)">
</div>
```

```typescript
onGestureMove(event: TftGestureEvent) {
  this.scale += event.interactEvent?.ds || 0;  // ds = delta scale
  const { x0, y0 } = event.interactEvent;
  this.transformOrigin = `${x0}px ${y0}px`;
}
```

---

## 8. Auto-Scroll

```html
<div class="scroll-container" tftAutoScroll>
  <div tftDragRoot>
    <div tftDraggable></div>
  </div>
</div>
```

Configure scroll sensitivity via `[autoScrollConfig]`:
```typescript
autoScrollConfig = { margin: 50, distance: 3, interval: 50, speed: 300, enabled: true };
```

---

## 9. Drag Preview Template

Customize the element shown while dragging using `*tftDragPreview` inside the draggable:

```html
<div tftDraggable [dragData]="item">
  <ng-template tftDragPreview>
    <div class="drag-ghost">{{ item.name }}</div>
  </ng-template>
  Original content
</div>
```

---

## 10. Lasso (Drag-to-Select)

`tftLasso` tracks a pointer drag on a background canvas and emits the selection rectangle. Hit-testing against child elements is the consumer's responsibility.

```html
<div tftLasso #lasso="tftLasso" [scale]="scale"
     (lassoStart)="clearSelection()"
     (lassoCommit)="onLassoCommit($event)">

  @if (lasso.lassoDisplayRect(); as r) {
    <div class="lasso-rect"
         [style.left.px]="r.x" [style.top.px]="r.y"
         [style.width.px]="r.w" [style.height.px]="r.h">
    </div>
  }

  <!-- your selectable items here -->
</div>
```

```typescript
onLassoCommit(rect: LassoRect) {
  // rect is in viewport (clientX/Y) space
  this.selectedItems = this.items.filter(item => {
    const el = this.itemRefs.get(item.id).nativeElement;
    const b = el.getBoundingClientRect();
    return b.left < rect.right && b.right > rect.left &&
           b.top < rect.bottom && b.bottom > rect.top;
  });
}
```

**Inputs:** `scale` (default `1`), `lassoDisabled` (default `false`).
**Outputs:** `lassoStart` (`void`), `lassoCommit` (`LassoRect`).
**Exported signals:** `isLassoing`, `lassoDisplayRect` (null when not dragging).

Uses Pointer Events internally — works with mouse, touch, and stylus.

---

## 11. Event Types

```typescript
TftDragEvent {
  interactEvent: NgDragEvent;
  dragRef: DraggableDirective;      // access dragData() signal here
  dragOrigin?: DropzoneDirective;
  dropTarget?: DropzoneDirective;
  positionInDropTarget: { x, y } | null;
}

TftDropEvent   // same shape as TftDragEvent

TftResizeEvent {
  interactEvent: NgResizeEvent;
  resizeRef: ResizableDirective;
  dragRef?: DraggableDirective;
  dragOrigin?: DropzoneDirective;
  dropTarget?: DropzoneDirective;
  positionInDropTarget: { x, y } | null;
  size: { width: number; height: number };
}

TftGestureEvent {
  gestureRef: GesturableDirective;
  interactEvent: GestureEvent;      // .ds = delta scale, .x0/.y0 = touch origin
}

LassoRect {
  left: number; right: number;
  top: number;  bottom: number;     // all in viewport (clientX/Y) space
}
```

---

## 12. Migration to v21.1.6 (Standalone + Signal Inputs)

Version 21.1.6 converted all directives to **standalone** and replaced `@Input()`/`@Output()` with signal-based `input()`/`output()`. If upgrading from an earlier version, apply the following changes.

### 12.1 — Import directives directly (no more NgModule required)

```typescript
// BEFORE
@NgModule({ imports: [InteractModule.forRoot({ cssDimensionUnit: 'px' })] })

// AFTER (standalone)
@Component({ imports: [DraggableDirective, DropzoneDirective, ResizableDirective, ...] })
```

`InteractModule` still works but is deprecated. `InteractService` is `providedIn: 'root'` so no explicit provision is needed.

### 12.2 — `dragData` and `dropzoneData` are now signals

Any code that reads these off an event's `dragRef` or `dropTarget` must now call them:

```typescript
// BEFORE
const team = event.dragRef.dragData.team;
const points = event.dropTarget.dropzoneData.points;

// AFTER
const team = event.dragRef.dragData().team;
const points = event.dropTarget.dropzoneData().points;
```

### 12.3 — `dropzoneId` is now a signal

```typescript
// BEFORE
if (event.dropTarget?.dropzoneId === 'yard') { ... }

// AFTER
if (event.dropTarget?.dropzoneId() === 'yard') { ... }
```

### 12.4 — CSS property names fixed on drag/resize host elements

The directives previously used camelCase property names in `Renderer2.setStyle` calls (`userSelect`, `touchAction`, `zIndex`). These are now correctly kebab-cased (`user-select`, `touch-action`, `z-index`). No template changes needed — this only affects the rendered DOM.

### 12.5 — `autoScrollConfig` is now a signal

If you read `autoScrollConfig` off an `AutoScrollDirective` reference directly, call it:

```typescript
// BEFORE
const config = this.auto_scroll_dir.autoScrollConfig;

// AFTER
const config = this.auto_scroll_dir.autoScrollConfig();
```

### 12.6 — `scale` on `AccountForScaleDirective` is now a signal

```typescript
// BEFORE
const scale = this.accountForScaleDir.scale;

// AFTER
const scale = this.accountForScaleDir.scale();
```
