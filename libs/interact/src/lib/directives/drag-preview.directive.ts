import {Directive, InjectionToken, Input, TemplateRef} from '@angular/core';

export const TFT_DRAG_PREVIEW = new InjectionToken<DragPreviewDirective>('DragPreviewDirective');

@Directive({
  selector: 'ng-template[tftDragPreview]',
  // providers: [{provide: TFT_DRAG_PREVIEW, useExisting: DragPreviewDirective}]
})
export class DragPreviewDirective<T = any> {

  @Input() dragData: T;
  constructor(public templateRef: TemplateRef<T>) {
    // console.log({templateRef: this.templateRef})
  }

}
