
# tft/interact

## An Angular plugin for the interactjs library

We aim to build a versatile API that exposes all the features of interactjs, but also simplifies implementing common behaviors.

## Installation

`npm i interactjs @tft/interact --save`

## Usage

Interactive documentation can be found on [Stackblitz](https://stackblitz.com/github/nayfin/tft-documentation?file=src%2Fapp%2Finteract-demo%2Flandscaping%2Fcontainers%2Fyard%2Fyard.component.html).

Here are some basic examples
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

### News
- gesture support in beta
- Stackblitz Examples
