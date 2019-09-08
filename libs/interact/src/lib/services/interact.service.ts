
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { tap, filter, map, shareReplay } from 'rxjs/operators';
import { TftDraggable, Delta, Size, Position } from '../models.ts/interact';

export interface InteractableSystem {
  deltas$: BehaviorSubject<Delta>;
  position$: BehaviorSubject<Position>;
  size$: BehaviorSubject<Size>;
  
  draggable$: Observable<TftDraggable>;
}

const defaultDelta: Delta = {
  deltaX: 0, 
  deltaY: 0, 
  targetElement: null 
};

const defaultSize: Size = {
  width: null, 
  height: null, 
  targetElement: null 
}

const defaultPosition: Position = {
  x: 0, 
  y: 0, 
  targetElement: null 
}

@Injectable({providedIn: 'root'})
export class InteractService {
  
  private _interactableIndex = 0;
  private renderer: Renderer2;

  get interactableCount() {
    return this._interactableIndex + 1;
  }
  
  readonly dragRegistry: {[key: string]: InteractableSystem } = {};
  
  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  addDeltaToPosition(delta: Delta, position: Position) {
    return {
      x: delta.deltaX + position.x,
      y: delta.deltaY + position.y,
      targetElement: delta.targetElement
    }
  }

  addDraggableToRegistry() {
    const key = this.createDragId(this._interactableIndex++);
    this.dragRegistry[key] = this.createDraggable(defaultPosition, defaultSize, defaultDelta);
    return key
  }

  destroyInteractable(interactableId: string) {
    if(this.dragRegistry[interactableId]) {
      delete this.dragRegistry[interactableId];
    }
  }

  subscribeToInteractable(interactableId: string) {
    return this.dragRegistry[interactableId];
  }

  createDraggable(initialPosition: Position, initialSize: Size, initialDelta: Delta ) {
    
    const deltas$ = new BehaviorSubject(initialDelta);
    // tracks the size of the element
    const size$ = new BehaviorSubject(initialSize);
    // Stream of positions as they change
    const position$ = new BehaviorSubject(initialPosition);
  
    // All draggable data mapped together
    const draggable$: Observable<TftDraggable> = combineLatest(
      size$.pipe(
        filter(resizeEvent => !!resizeEvent.targetElement),
        tap(({width, height, targetElement}) => this.setElementSize(width, height, targetElement))
      ),
      deltas$.pipe(
        filter(delta => !!delta.targetElement),
        tap((delta) => {
          const position = position$.value;
          const newPosition = this.addDeltaToPosition(delta, position);
          position$.next(newPosition);
        })
      ),
      position$.pipe(
        filter(position => !!position.targetElement),
        tap( position => this.setElementTransform(position.x, position.y, position.targetElement))
      )
    ).pipe(
      shareReplay(1),
      map( ([size, deltas, position]): TftDraggable => {
        return {
          x: position.x,
          y: position.y,
          deltaX: deltas.deltaX,
          deltaY: deltas.deltaY,
          width: size.width,
          height: size.height,
          targetElement: size.targetElement || position.targetElement
        }
      }),  
    )
    return {
      deltas$,
      position$,
      size$,
      draggable$
    }
  }

  createDragId(index: number) {
    return `draggable${index}`
  }
  
  updateDeltas(interactId, { deltaX, deltaY }, targetElement) {
    if (!this.interactableExistOnRegistry(interactId)) return;
    this.dragRegistry[interactId].deltas$.next({ deltaX, deltaY, targetElement })
  }

  updatePosition(interactId, { x, y }, targetElement) {
    if (!this.interactableExistOnRegistry(interactId)) return;
    this.dragRegistry[interactId].position$.next({ x, y, targetElement })
  }

  updateSize(interactId, { deltaX, deltaY, width, height }, targetElement) {
    if (!this.interactableExistOnRegistry(interactId)) return
    // only reposition if necessary i.e when resizing left or up
    if(deltaX || deltaY) {
      this.updateDeltas(interactId, {deltaX, deltaY}, targetElement);
    }
    this.dragRegistry[interactId].size$.next({width, height, targetElement});
  }

  interactableExistOnRegistry(interactId) {
    return this.dragRegistry.hasOwnProperty(interactId);
  }
  setElementSize(width: number, height: number, target: any) {
    this.renderer.setStyle(target, 'width', `${width}px`);
    this.renderer.setStyle(target, 'height', `${height}px`);
  }

  setElementTransform(x: number, y: number, target: any) {
    const transformString = `translate3d(${x}px, ${y}px, 0)`;
    this.renderer.setStyle(target, 'transform', transformString );
  }
}
