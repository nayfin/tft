import { DropzoneDirective, DraggableDirective, GesturableDirective, ResizableDirective } from '../directives';
import { Point, DragEvent, ResizeEvent, Interactable, DropEvent, GestureEvent } from '@interactjs/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';



export type CssDimensionUnit = 'px' | 'em';
export interface InteractRootConfig {
  cssDimensionUnit: CssDimensionUnit;
}
export const INTERACT_ROOT_CONFIG = new InjectionToken<InteractRootConfig>('INTERACT_ROOT_CONFIG_PARAMS');

export const DEFAULT_REGISTRY_ID = 'DEFAULT';
/**
 * Default initial value for Delta BehaviorSubject
 */
export const defaultDelta: Delta = {
  deltaX: 0,
  deltaY: 0,
  targetElement: null
};
/**
 * Default initial value for Size BehaviorSubject
 */
export const defaultSize: Size = {
  width: null,
  height: null,
  targetElement: null
}
/**
 * Default initial value for Position BehaviorSubject
 */
export const defaultPosition: Position = {
  x: 0,
  y: 0,
  targetElement: null
}
/**
 * The shape of the state/events/behavior system for each dropzone
 * and the DEFAULT_REGISTRY_ID system (for drop components initialized outside
 * of a dropzone).
 */
export interface InteractableSystem {
  deltas$: BehaviorSubject<Delta>;
  position$: BehaviorSubject<Position>;
  size$: BehaviorSubject<Size & Delta>;

  interactable$: Observable<TftCoords>;
}
/**
 * The key map of InteractableSystems. One for the drag components
 * that originated outside of a dropzone, plus one for each dropzone.
 */
export interface InteractableRegistry {
  [key: string]: InteractableSystem
}

/**
 * HTMLElement with helpful drag directives attached to facilitate moving drag data between dropzones
 */
export type TftDragElement = HTMLElement & {
  dragRef?: DraggableDirective
  dragOrigin?: DropzoneDirective
  dropTarget?: DropzoneDirective
}

/**
 * HTMLElement with helpful drag directives attached to facilitate moving drag data between dropzones
 */
 export type TftResizeElement = HTMLElement & {
  resizeRef?: ResizableDirective
}

/**
 * Extends the interact drop events by adding reference to the dropped components drag
 * directive to the html element. This gives the dropzone access to things like data
 * and parent dropzone of the dropped component.
 */
export type NgDropEvent = DropEvent & {
  draggable:  Interactable & {
    target: TftDragElement;
  };
  relatedTarget: TftDragElement;
};
/**
 * Extends the interact resize events by adding a reference to the dragRef
 * directive to the html element.
 */
export type  NgResizeEvent = ResizeEvent & {
  draggable:  Interactable & {
    target: TftDragElement;
  };
};
/**
 * We extend the interact DragEvent a little here, adding to the target element references for:
 *  - the component we are dragging (dragRef)
 *  - the dropzone component where the drag component originated (dragOrigin)
 *  - the dropzone component that it was dropped in (dropTarget)
 * This helps us to pass references to directive classes as events like dragenter and drag exit happens.
 * We use these references to emit a (mostly) consistent event across drag, drop, resize event.
 */
export type NgDragEvent = DragEvent & {
  dropzone: { target: HTMLElement},
  target: TftDragElement
};
/**
 * Event emitted when resizing, dragging, dropping
 */
export interface TftInteractableEvent {
  dragRef: DraggableDirective;
  dragOrigin?: DropzoneDirective;
  dropTarget?: DropzoneDirective;
  positionInDropTarget: Point;
}
/**
 * Event emitted on drop
 */
export interface TftDropEvent extends TftInteractableEvent {
  interactEvent: NgDropEvent
}
/**
 * Event emitted on drag
 */
export interface TftDragEvent extends TftInteractableEvent {
  interactEvent: NgDragEvent
}
/**
 * Event emitted on resize
 */
export interface TftResizeEvent extends TftInteractableEvent {
  interactEvent: ResizeEvent,
  resizeRef: ResizableDirective
}

export type TftCoords= Delta & Position & Size;

export interface Delta {
  deltaX: number | null;
  deltaY: number | null;
  targetElement: TftDragElement | null;
}

export interface Position {
  x: number | null;
  y: number | null;
  targetElement: TftDragElement | null;
}

export interface Size {
  width: number | null;
  height: number | null;
  targetElement: TftResizeElement | null;
}

export interface TftGestureEvent {
  gestureRef: GesturableDirective;
  interactEvent: GestureEvent;
}
