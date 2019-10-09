# interact

## THIS LIBRARY WILL HAVE BREAKING CHANGES DAILY

## PLEASE DO NOT USE THIS FOR ANYTHING CLOSE TO PRODUCTION UNTIL STABLE

This is an angular wrapper for the interactjs library. We aim to build a versatile API that will all deep customization of drag behavior while also simplifying common usage of common behaviors.

## Installation

`npm i interactjs @tft/interact --save`

## Usage

### Draggables

```html
<div tftDraggable></div>
```

### Resizable

```html
<div tftResizable></div>
```

## Roadmap

- method of cloning/replacing drag item
- performance testing
  - look into using Cypress for this
  - ngZone runOutsideAngular
  - round coordinates and filter duplicates
  - performing drag behavior when listening to output vs. passing callback through the config
- method of correlating and passing data between drag item and drop zone
- way to eject all drag registry state to end-developer
  - move dragRegistry into a BehaviorSubject? (wait until can test performance impact)
