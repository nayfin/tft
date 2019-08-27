
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap, scan, distinct, filter, map } from 'rxjs/operators';

@Injectable()
export class InteractService {

  private location$ = new BehaviorSubject({ x: 0, y: 0, el: null });
  private size$ = new BehaviorSubject({ deltaX: 0, deltaY: 0, width: 150, height: 150, el: null });


  
  constructor() {

    this.location$.pipe(
      // ensure we have an element to drag
      filter(location => location.el),
      // we add the deltas to the positions state as the drag events come through
      scan((acc, deltaLocation ) => {
        if (deltaLocation.el) {
          return {
            x: (deltaLocation.x + acc.x),
            y: (deltaLocation.y + acc.y),
            el: acc.el
          };
        }
      }),
      tap(location => { 
        this.setElementTransform(location.x, location.y, location.el);
      })
    ).subscribe();

    this.size$.pipe(
      // ensure we have an element to drag
      filter(size => size.el),
      tap(size => {
        const { el, deltaX, deltaY, height, width} = size;
        // When resizing up or left we need to adjust location of element as well
        if(deltaX || deltaY) {
          this.updateLocation({ deltaX, deltaY }, el);
        }
        this.setElementSize(width, height, el);
      })
    ).subscribe();
  }

  updateLocation({ deltaX, deltaY }, el) {
    this.location$.next({ x: deltaX, y: deltaY, el })
  }

  updateSize({ deltaX, deltaY, width, height }, el) {
    this.size$.next({ deltaX, deltaY, width, height, el })
  }

  setElementSize(width: number, height: number, target: any) {
    target.style.width  = width + 'px';
    target.style.height = height + 'px';
  }

  setElementTransform(x: number, y: number, target: any) {
    const transformString = `translate3d(${x}px, ${y}px, 0)`;
    target.style.webkitTransform = target.style.transform = transformString;
  }
}
