# @tft/interact

Angular directive wrapper for interactjs. Handles drag-and-drop, resize, and gesture interactions with scale support.

## Install
```bash
npm i interactjs @tft/interact
```
Add `InteractModule` to your module's `imports`.

## Directives

| Directive               | Selector               | Purpose |
|-------------------------|------------------------|---------|
| `DraggableDirective`    | `[tftDraggable]`      | Makes element draggable |
| `DropzoneDirective`     | `[tftDropzone]`       | Makes element a drop target |
| `ResizableDirective`    | `[tftResizable]`      | Makes element resizable |
| `DragRootDirective`     | `[tftDragRoot]`       | Sets where drag clone is appended during drag |
| `AccountForScaleDirective` | `[tftAccountForScale]` | Tells drag/resize to compensate for CSS scale |
| `AutoScrollDirective`   | `[tftAutoScroll]`     | Auto-scrolls container during drag |
| `GesturableDirective`   | `[tftGesturable]`     | Pinch/gesture support (beta) |

## tftDraggable
```html
<div tftDraggable
  [x]="x" [y]="y"
  [dragData]="item"
  [dragConfig]="{ lockAxis: 'x' }"
  [dragDisabled]="isDisabled"
  [dragRoot]="dragRoot"
  (dragStart)="onDragStart($event)"
  (dragMove)="onDragMove($event)"
  (dragEnd)="onDragEnd($event)">
</div>
```
Key inputs: `x`, `y`, `dragData`, `dragConfig` (raw interactjs options), `dragDisabled`, `showPlaceholder`, `dragRoot`, `dragZIndex`, `zIndex`, `interactableId`

Key outputs: `dragStart`, `dragMove`, `dragEnd`, `dragInertiaStart` — all emit `TftDragEvent`

## tftDropzone
```html
<div tftDropzone
  [dropzoneConfig]="{ accept: '.draggable' }"
  (dragDrop)="onDrop($event)"
  (dragEnter)="onEnter($event)"
  (dragLeave)="onLeave($event)">
</div>
```
Key inputs: `dropzoneId`, `dropzoneConfig` (raw interactjs options), `dropzoneData`, `position`

Key outputs: `dragDrop`, `dragEnter`, `dragLeave`, `dropActivate` — all emit `TftDropEvent`

## tftResizable
```html
<div tftResizable
  [width]="w" [height]="h"
  [resizeConfig]="{ edges: { right: true, bottom: true } }"
  [resizeDisabled]="isDisabled"
  (resizeEnd)="onResizeEnd($event)">
</div>
```
Key inputs: `width`, `height`, `resizeConfig`, `resizeDisabled`, `position`

Key outputs: `resizeStart`, `resizeMove`, `resizeEnd`, `resizeInertiaStart` — all emit `TftResizeEvent`

`TftResizeEvent` includes `size: { width, height }` and `positionInDropTarget: { x, y } | null`

## Scale support
Use `tftAccountForScale` on the same element as `tftDragRoot` when CSS `scale()` is applied. Both drag and resize directives read it automatically:
```html
<div tftDragRoot tftAccountForScale [scale]="scale">
  <div tftDraggable tftResizable [scale]="scale"></div>
</div>
```

## Drag preview template
Customize the clone shown while dragging using `*tftDragPreview` inside the draggable:
```html
<div tftDraggable>
  <ng-template tftDragPreview>
    <div class="my-preview">...</div>
  </ng-template>
  Original content
</div>
```

## Full example (drag + resize + dropzone + scale + gesture)
```html
<div class="scroll-container" tftAutoScroll>
  <div
    tftDragRoot tftAccountForScale tftDropzone tftGesturable
    [scale]="scale"
    #dragRoot="tftDragRoot"
    (gestureMove)="onGestureMove($event)">

    <div
      tftDraggable tftResizable
      [dragDisabled]="disabled"
      [resizeDisabled]="disabled"
      [width]="w" [height]="h"
      (resizeEnd)="onResizeEnd($event)">
    </div>
  </div>
</div>
```
```ts
scale = 1;
w = 200; h = 300;

onResizeEnd(event: TftResizeEvent) {
  this.w = event.size.width;
  this.h = event.size.height;
}
onGestureMove(event: TftGestureEvent) {
  this.scale += event.interactEvent?.ds || 0;
}
```

## Cross-dropzone dragging
When a draggable lives in one dropzone and needs to be dropped into another, pass a `dragRoot` that is a parent of both:
```html
<div tftDragRoot #dragRoot="tftDragRoot">
  <div tftDropzone>
    <div tftDraggable [dragRoot]="dragRoot"></div>
  </div>
  <div tftDropzone (dragDrop)="onDrop($event)"></div>
</div>
```

## Event types
```ts
TftDragEvent   { interactEvent, dragRef, dragOrigin, dropTarget, positionInDropTarget }
TftDropEvent   { interactEvent, dragRef, dragOrigin, dropTarget, positionInDropTarget }
TftResizeEvent { interactEvent, resizeRef, dragRef, dragOrigin, dropTarget, positionInDropTarget, size }
TftGestureEvent { interactEvent }
```

## Export skill
`libs/interact/export-skill/SKILL.md` contains the published skill docs with usage examples, directive reference, and migration guide.

**Whenever a new directive, input, output, or breaking change is made to this library, update `SKILL.md`** — add or extend the relevant section and update the migration guide if the change affects existing consumers.

## Key files
- `libs/interact/src/lib/directives/` — all directive implementations
- `libs/interact/src/lib/services/interact.service.ts` — position/size registry
- `libs/interact/src/lib/models/` — event types and interfaces
- `apps/documentation/src/app/interact-demo/landscaping/` — full real-world example
