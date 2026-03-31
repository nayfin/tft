import { AccountForScaleDirective } from './account-for-scale.directive';
import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';

/**
 * Use this directive to select which element to attach the element to while dragging
 * @example <div tftDragRoot><div tftDraggable> </div> </div>
 * @note this directive will overwrite any style transformations (e.g. transform: scale(2); )
 */
@Directive({
  selector: '[tftDragRoot]',
  exportAs: 'tftDragRoot',
  standalone: true,
})
export class DragRootDirective implements OnDestroy {
  el = inject(ElementRef);
  // This is used when passing a dragRoot as in input to a draggable element that not a child of that dragRoot
  // It allows the the interact service to check if the drag root has some scaling applied to it and account for it when the component is dragged
  account_for_scale_dir? = inject(AccountForScaleDirective, { optional: true, self: true });

  private _suppressNextClick = false;
  private _captureListener: (e: MouseEvent) => void;

  constructor() {
    // Registered in capture phase so it fires before any bubble-phase listeners,
    // including Angular template (click) bindings on this element. Suppresses the
    // spurious click that fires after a drag ends when the clone (a direct child of
    // this element) receives the pointerup and bubbles the event up.
    this._captureListener = (event: MouseEvent) => {
      if (this._suppressNextClick) {
        this._suppressNextClick = false;
        event.stopImmediatePropagation();
      }
    };
    this.el.nativeElement.addEventListener('click', this._captureListener, true);
  }

  /**
   * Called by DraggableDirective on dragend to suppress the spurious click that
   * fires when the drag clone (appended as a direct child of this element) receives
   * the pointerup and bubbles a click event up to this element.
   */
  suppressNextClick() {
    this._suppressNextClick = true;
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('click', this._captureListener, true);
  }
}
