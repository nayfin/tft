
# tft/interact

## WARNING: THIS LIBRARY IS IN BETA 
Our API is stabilizing but changes could happen at any time

## Description
This is an angular wrapper for the interactjs library. We aim to build a versatile API that exposes all the features of interactjs, but also simplifies implementing common behaviors.

## Installation

`npm i interactjs --save`
`npm i @tft/interact --save`

## Usage

### Draggables

```html
<div tftDraggable 
  dragConfig="dragConfig"
  [x]="x"
  [y]="y">
</div>
```

Any config that will work with with interactjs will work here
```typescript
dragConfig = {
  enabled = true,
  lockAxis
}
```
### Resizable

```html
<div tftResizable></div>
```

### Stackblitz Examples
 COMING SOON!

### Docs
  COMING SOON!