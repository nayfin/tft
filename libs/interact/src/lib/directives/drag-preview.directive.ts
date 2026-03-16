import { Directive, InjectionToken, Input, TemplateRef, inject } from '@angular/core';

export const TFT_DRAG_PREVIEW = new InjectionToken<DragPreviewDirective>('DragPreviewDirective');

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'ng-template[tftDragPreview]',
    standalone: false
})
export class DragPreviewDirective<T = any> {
  templateRef = inject<TemplateRef<T>>(TemplateRef);


  @Input() dragData: T;
}
