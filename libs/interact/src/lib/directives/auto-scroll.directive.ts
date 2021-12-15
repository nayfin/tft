import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { scan, shareReplay } from 'rxjs/operators';

interface ScrollObject {scrollTop: number, scrollLeft: number};
/**
 * Use to apply scale to the element and tell the drag and resize directives to account for the scale when
 * @example <div tftAccountForScale [scale]="2.5"> <div tftDraggable> </div> </div>
 * @note if `dragRoot` is used this directive should be used on the same element to ensure that the drag
 * element accounts for scale
 */
@Directive({
  selector: '[tftAutoScroll]'
})
export class AutoScrollDirective {
  /**
   * Limit minimum time between scroll events in milliseconds
   */
  @Input() autoScrollConfig = {
    margin: 50,
    distance: 3,
    interval: 50,
    speed: 300,
    enabled: true
  };
  private scrollSubject: BehaviorSubject<ScrollObject>;
  readonly scrollObserver: Observable<ScrollObject>;
  readonly scrollDeltaObserver = new Subject<ScrollObject>();
  // this setup allows consumers to set x, y scale independently or just set them both with scale
  @HostListener('scroll', ['$event']) scroll(scrollEvent: Event) {
    const target = (scrollEvent.target as HTMLElement);
    const { scrollTop, scrollLeft } = target;
    this.scrollSubject.next({scrollTop, scrollLeft})
  }


  constructor(
    public el: ElementRef
  ) {
    const { scrollTop, scrollLeft } = (el.nativeElement as HTMLElement);
    this.scrollSubject = new BehaviorSubject({scrollTop, scrollLeft});
    this.scrollObserver = this.scrollSubject.pipe(
      scan((previous, current) => {
        const scrollTop = current.scrollTop - previous.scrollTop;
        const scrollLeft = current.scrollLeft - previous.scrollLeft;
        this.scrollDeltaObserver.next({scrollTop, scrollLeft});
        return current;
      }),
      shareReplay(1),
    )
    this.scrollObserver.subscribe();
  }

}
