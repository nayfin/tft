import { DraggableDirective } from '../directives/draggable.directive';
import DropEvent from '@interactjs/actions/drop/DropEvent'
import Interactable from '@interactjs/core/Interactable';
import { DropzoneDirective } from '../directives/dropzone.directive';
import { Point } from '@interactjs/types/types';

/**
 * Extends the interact drop events by adding reference to the dropped components drag  
 * directive to the html element. This gives the dropzone access to things like data
 * and parent dropzone of the dropped component.
 */
export type NgDropEvent = DropEvent & { draggable:  Interactable & {target: HTMLElement & { dragRef: DraggableDirective} } };

export interface TftDropEvent {
  event: NgDropEvent
  dragRef: DraggableDirective,
  previousContainer: DropzoneDirective,
  dropPoint: Point
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