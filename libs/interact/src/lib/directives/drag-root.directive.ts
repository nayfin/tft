import { AccountForScaleDirective } from './account-for-scale.directive';
import { Directive, ElementRef, Optional, Self } from '@angular/core';

/**
 * Use this directive to select which element to attach the element to while dragging
 * @example <div tftDragRoot><div tftDraggable> </div> </div>
 * @note this directive will overwrite any style transformations (e.g. transform: scale(2); )
 */
@Directive({
  selector: '[tftDragRoot]',
  exportAs: 'tftDragRoot'
})
export class DragRootDirective {

  constructor(
    public el: ElementRef,
    // This is used when passing a dragRoot as in input to a draggable element that not a child of that dragRoot
    // It allows the the interact service to check if the drag root has some scaling applied to it and account for it when the component is dragged
    @Optional() @Self() public account_for_scale_dir?: AccountForScaleDirective
  ) { }
}
