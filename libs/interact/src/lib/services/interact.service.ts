
import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable, merge, combineLatest } from 'rxjs';
import { tap, scan, filter, map } from 'rxjs/operators';
import { TftDraggable } from '../models.ts/draggable';

@Injectable()
export class InteractService {

  // tracks the position deltas as they occur
  readonly deltas$ = new BehaviorSubject({x: 0, y: 0, targetElement: null });
  // tracks the size of the element
  readonly size$ = new BehaviorSubject({width: 250, height: 250, targetElement: null });
  // Stream of positions as they change
  readonly position$ = new BehaviorSubject({x: 0, y: 0, targetElement: null });
   
  readonly draggable$: Observable<TftDraggable> = combineLatest(
    this.size$.pipe(
      filter(resizeEvent => !!resizeEvent.targetElement),
      tap(({width, height, targetElement}) => this.setElementSize(width, height, targetElement))
    ),
    this.position$.pipe(
      filter(position => !!position.targetElement),
      tap( position => this.setElementTransform(position.x, position.y, position.targetElement))
    )
  ).pipe(
    map( ([size, position]): TftDraggable => {
      return {
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
        targetElement: size.targetElement || position.targetElement
      }
    }),  
  ); 

  constructor(
    private renderer: Renderer2
  ) {
    this.deltas$.pipe(
      filter(dragEvent => !!dragEvent.targetElement),
      tap((dragEvent:{x: number, y: number, targetElement: any}) => {
        const position = this.position$.value;
        const newPosition = {
          x: dragEvent.x + position.x,
          y: dragEvent.y + position.y,
          targetElement: dragEvent.targetElement
        }
        this.position$.next(newPosition);
      })
    ).subscribe();
    this.draggable$.subscribe();
  }

  updateDeltas({ x, y }, targetElement) {
    this.deltas$.next({ x, y, targetElement })
  }

  updatePosition({ x, y }, targetElement) {
    this.position$.next({ x, y, targetElement })
  }

  updateSize({ deltaX, deltaY, width, height }, targetElement) {
    // only reposition if necessary i.e when resizing left or up
    if(deltaX || deltaY) {
      this.updateDeltas({x: deltaX, y: deltaY}, targetElement);
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
