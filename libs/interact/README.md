
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
<div tftDraggable ></div>
```

### Resizable

```html
<div tftResizable></div>
```

## Roadmap
- github pages docs 
- performance testing
  - look into using Cypress for this
  - ngZone runOutsideAngular
  - round coordinates and filter duplicates
  - performing drag behavior when listening to output vs. passing callback through the config

- way to eject all drag registry state to end-developer
  - move dragRegistry into a BehaviorSubject? (wait until can test performance impact)
