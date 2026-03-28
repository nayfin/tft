import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { scan, shareReplay } from 'rxjs/operators';

interface ScrollObject { scrollTop: number, scrollLeft: number }

@Directive({
  selector: '[tftAutoScroll]',
  standalone: true,
})
export class AutoScrollDirective {
  el = inject(ElementRef);

  autoScrollConfig = input({
    margin: 50,
    distance: 3,
    interval: 50,
    speed: 300,
    enabled: true,
  });

  private scrollSubject: BehaviorSubject<ScrollObject>;
  readonly scrollObserver: Observable<ScrollObject>;
  readonly scrollDeltaObserver = new Subject<ScrollObject>();

  @HostListener('scroll', ['$event']) scroll(scrollEvent: Event) {
    const target = (scrollEvent.target as HTMLElement);
    const { scrollTop, scrollLeft } = target;
    this.scrollSubject.next({ scrollTop, scrollLeft });
  }

  constructor() {
    const el = this.el;
    const { scrollTop, scrollLeft } = (el.nativeElement as HTMLElement);
    this.scrollSubject = new BehaviorSubject({ scrollTop, scrollLeft });
    this.scrollObserver = this.scrollSubject.pipe(
      scan((previous, current) => {
        const scrollTop = current.scrollTop - previous.scrollTop;
        const scrollLeft = current.scrollLeft - previous.scrollLeft;
        this.scrollDeltaObserver.next({ scrollTop, scrollLeft });
        return current;
      }),
      shareReplay(1),
    );
    this.scrollObserver.subscribe();
  }
}
