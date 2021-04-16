import {Directive, InjectionToken, Input, TemplateRef} from '@angular/core';

export const TFT_DRAG_PREVIEW = new InjectionToken<DragPreviewDirective>('DragPreviewDirective');

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[tftDragPreview]',
 })
export class DragPreviewDirective<T = any> {

  @Input() dragData: T;
  constructor(public templateRef: TemplateRef<T>) { }
}
