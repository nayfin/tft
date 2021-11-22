import { Directive, ElementRef, Optional, Self } from '@angular/core';
import { AccountForScaleDirective } from './account-for-scale.directive';

/**
 * Use this directive to select which element to attach the element to while dragging
 * @example <div tftDragRoot><div tftDraggable> </div> </div>
 * @note this directive will overwrite any style transformations (e.g. transform: scale(2); )
 */
@Directive({
  selector: '[tftDragRoot]'
})
export class DragRootDirective {

  constructor(
    public el: ElementRef,
    @Optional() @Self() account_for_scale_dir?: AccountForScaleDirective
  ) {
    // This accounts for a bug where drag element is misaligned when using a drag root
    // with a dropzone inside of it and a drag item inside the dropzone
    // e.g <div tftDragRoot> <div tftDropzone> <div tftDraggable</div> </div> </div>
    // TODO: This is a band-aid, root cause is misunderstood, it started after switching from
    // using `translate3d` to top/left for positioning
    if(!account_for_scale_dir) {
      (el.nativeElement as HTMLElement).style.transform = 'scale(1)';
    }
  }
}
