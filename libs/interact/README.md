
# tft/interact

## WARNING: THIS LIBRARY IS IN BETA
Our API is stabilizing but changes could happen at any time

## Description
This is an angular wrapper for the interactjs library. We aim to build a versatile API that exposes all the features of interactjs, but also simplifies implementing common behaviors.

## Installation

`npm i interactjs@~1.6.0 --save`
Make sure to version lock interact to < 1.7.0, newer versions have a TypeScript compatibility build issue.

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
```ts
dragConfig = {
  enabled = true,
  lockAxis:  'y'
}
```
### Resizable

```html
<div tftResizable></div>
```

Interactive documentation can be found on Stackblitz [here](https://stackblitz.com/github/nayfin/tft-documentation).

### COMING SOON!
- interact gesture support
- Stackblitz Examples
- Docs