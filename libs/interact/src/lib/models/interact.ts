import { DraggableDirective } from '../directives/draggable.directive';
import DropEvent from '@interactjs/actions/drop/DropEvent'
import Interactable from '@interactjs/core/Interactable';
import { DropzoneDirective } from '../directives/dropzone.directive';
import { Point, DragEvent, ResizeEvent } from '@interactjs/types/types';
import { BehaviorSubject, Observable } from 'rxjs';

export const defaultDelta: Delta = {
  deltaX: 0, 
  deltaY: 0, 
  targetElement: null 
};

export const defaultSize: Size = {
  width: null, 
  height: null, 
  targetElement: null 
}

export const defaultPosition: Position = {
  x: 0, 
  y: 0, 
  targetElement: null 
}
export interface InteractableSystem {
  deltas$: BehaviorSubject<Delta>;
  position$: BehaviorSubject<Position>;
  size$: BehaviorSubject<Size & Delta>;
  
  interactable$: Observable<TftDraggable>;
}

export interface InteractableRegistry {
  [key: string]: InteractableSystem  
} 
/**
 * Extends the interact drop events by adding reference to the dropped components drag  
 * directive to the html element. This gives the dropzone access to things like data
 * and parent dropzone of the dropped component.
 */
export type NgDropEvent = DropEvent & { 
  draggable:  Interactable & {
    target: HTMLElement & { 
      dragRef: DraggableDirective
      dragOrigin?: DropzoneDirective
      dropTarget?: DropzoneDirective
    } 
  } 
};

export type NgDragEvent = DragEvent & { 
  target: HTMLElement & { 
    dragRef: DraggableDirective
    dragOrigin?: DropzoneDirective
    dropTarget?: DropzoneDirective
  } 
};

export interface TftInteractableEvent {
  dragRef: DraggableDirective;
  dragOrigin: DropzoneDirective;
  dropTarget: DropzoneDirective;
  positionInDropzone: Point;  
}
export interface TftDropEvent extends TftInteractableEvent {
  event: NgDropEvent
}
export interface TftDragEvent extends TftInteractableEvent {
  event: NgDragEvent
}

export interface TftResizeEvent extends TftInteractableEvent {
  event: ResizeEvent
}

export type TftDraggable = Delta & Position & Size;

export interface Delta {
  deltaX: number | null;
  deltaY: number | null;
  targetElement: any | null;
}

export interface Position {
  x: number | null;
  y: number | null;
  targetElement: any | null;
}

export interface Size {
  width: number | null; 
  height: number | null; 
  targetElement: any;
}