# @tft/interact

An Angular directive library wrapping [interactjs](https://interactjs.io/) for drag-and-drop, resize, gesture, auto-scroll, and lasso selection.

---

## Installation

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

## Directives

| Directive | Selector | Purpose |
|---|---|---|
| `DraggableDirective` | `[tftDraggable]` | Makes an element draggable |
| `DropzoneDirective` | `[tftDropzone]` | Defines a drop target |
| `ResizableDirective` | `[tftResizable]` | Makes an element resizable |
| `GesturableDirective` | `[tftGesturable]` | Pinch/rotate gesture support |
| `DragRootDirective` | `[tftDragRoot]` | Sets where the drag clone is appended |
| `AccountForScaleDirective` | `[tftAccountForScale]` | Compensates coordinates for CSS `scale()` |
| `ApplyScaleDirective` | `[tftApplyScale]` | Applies a scale value as `font-size` |
| `AutoScrollDirective` | `[tftAutoScroll]` | Auto-scrolls a container during drag |
| `LassoDirective` | `[tftLasso]` | Drag-to-select rectangle on a canvas |
| `DragPreviewDirective` | `ng-template[tftDragPreview]` | Custom template for the drag clone |
| `ArrayOfNPipe` | `arrayOfN` | Creates an array of N items for `@for` |

---

## Draggable

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

**Inertia + restrict example:**
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

## Dropzone

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

```typescript
onDrop(event: TftDropEvent) {
  if (event.dropTarget?.dropzoneId() === 'yard') { ... }
  const data = event.dragRef.dragData();
}
```

---

## Resizable

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

## Scale Support

Use `tftAccountForScale` on the drag root when CSS `scale()` is applied:

```html
<div tftDragRoot tftAccountForScale [scale]="scale">
  <div tftDraggable tftResizable [width]="w" [height]="h"></div>
</div>
```

For cross-dropzone dragging where the draggable is not a child of the drag root:
```html
<div tftDragRoot tftAccountForScale [scale]="scale" #root="tftDragRoot">
  <div tftDropzone>
    <div tftDraggable [dragRoot]="root"></div>
  </div>
  <div tftDropzone (dragDrop)="onDrop($event)"></div>
</div>
```

---

## Gesture (pinch-to-zoom)

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

## Auto-Scroll

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

## Drag Preview Template

```html
<div tftDraggable [dragData]="item">
  <ng-template tftDragPreview>
    <div class="drag-ghost">{{ item.name }}</div>
  </ng-template>
  Original content
</div>
```

---

## Lasso (Drag-to-Select)

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
</div>
```

```typescript
onLassoCommit(rect: LassoRect) {
  // rect is in viewport (clientX/Y) space
  this.selected = this.items.filter(item => {
    const b = this.itemEl(item).getBoundingClientRect();
    return b.left < rect.right && b.right > rect.left &&
           b.top < rect.bottom && b.bottom > rect.top;
  });
}
```

**Inputs:** `scale` (default `1`), `lassoDisabled` (default `false`).
**Outputs:** `lassoStart` (`void`), `lassoCommit` (`LassoRect`).
**Exported signals:** `isLassoing`, `lassoDisplayRect` (null when not dragging).

Uses Pointer Events — works with mouse, touch, and stylus.

---

## Event Types

```typescript
TftDragEvent {
  interactEvent: NgDragEvent;
  dragRef: DraggableDirective;      // dragRef.dragData() to get payload
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

## Migration to v21.1.6

Version 21.1.6 converted all directives to **standalone** and replaced `@Input()`/`@Output()` with signal-based `input()`/`output()`.

### Import directives directly

```typescript
// BEFORE
@NgModule({ imports: [InteractModule.forRoot({ cssDimensionUnit: 'px' })] })

// AFTER
@Component({ imports: [DraggableDirective, DropzoneDirective, ResizableDirective, ...] })
```

`InteractModule` still works but is deprecated. `InteractService` is `providedIn: 'root'`.

### `dragData` and `dropzoneData` are now signals

```typescript
// BEFORE
const team = event.dragRef.dragData.team;
const points = event.dropTarget.dropzoneData.points;

// AFTER
const team = event.dragRef.dragData().team;
const points = event.dropTarget.dropzoneData().points;
```

### `dropzoneId` is now a signal

```typescript
// BEFORE
if (event.dropTarget?.dropzoneId === 'yard') { ... }

// AFTER
if (event.dropTarget?.dropzoneId() === 'yard') { ... }
```

### `autoScrollConfig` and `scale` are now signals

```typescript
// BEFORE
const config = this.autoScrollDir.autoScrollConfig;
const scale = this.accountForScaleDir.scale;

// AFTER
const config = this.autoScrollDir.autoScrollConfig();
const scale = this.accountForScaleDir.scale();
```
