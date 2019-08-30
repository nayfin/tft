
import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap, filter, map, shareReplay } from 'rxjs/operators';
import { TftDraggable, Delta, Size, Position } from '../models.ts/interact';

const initialDelta: Delta = {
  deltaX: 0, 
  deltaY: 0, 
  targetElement: null 
};

const initialSize: Size = {
  width: null, 
  height: null, 
  targetElement: null 
}

const initialPosition: Position = {
  x: 0, 
  y: 0, 
  targetElement: null 
}

@Injectable()
export class InteractService {
  private _dragIndex = 0;
  get dragIndex() {
    return this._dragIndex;
  }
  readonly dragRegistry: {};
  // tracks the position deltas as they occur
  readonly deltas$ = new BehaviorSubject(initialDelta);
  // tracks the size of the element
  readonly size$ = new BehaviorSubject(initialSize);
  // Stream of positions as they change
  readonly position$ = new BehaviorSubject(initialPosition);
  // All draggable data mapped together
  readonly draggable$: Observable<TftDraggable> = combineLatest(
    this.size$.pipe(
      filter(resizeEvent => !!resizeEvent.targetElement),
      tap(({width, height, targetElement}) => this.setElementSize(width, height, targetElement))
    ),
    this.deltas$.pipe(
      filter(delta => !!delta.targetElement),
      tap((delta) => {
        const position = this.position$.value;
        const newPosition = this.addDeltaToPosition(delta, position);
        this.position$.next(newPosition);
      })
    ),
    this.position$.pipe(
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
  ); 

  constructor(
    private renderer: Renderer2
  ) {
    this.draggable$.subscribe();
  }

  addDeltaToPosition(delta: Delta, position: Position) {
    return {
      x: delta.deltaX + position.x,
      y: delta.deltaY + position.y,
      targetElement: delta.targetElement
    }
  }

  updateDeltas({ deltaX, deltaY }, targetElement) {
    this.deltas$.next({ deltaX, deltaY, targetElement })
  }

  updatePosition({ x, y }, targetElement) {
    this.position$.next({ x, y, targetElement })
  }

  updateSize({ deltaX, deltaY, width, height }, targetElement) {
    // only reposition if necessary i.e when resizing left or up
    if(deltaX || deltaY) {
      this.updateDeltas({deltaX, deltaY}, targetElement);
    }
    this.size$.next({width, height, targetElement});
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
