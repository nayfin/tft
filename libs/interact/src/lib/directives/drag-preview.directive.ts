import { Directive, InjectionToken, TemplateRef, inject, input } from '@angular/core';

export const TFT_DRAG_PREVIEW = new InjectionToken<DragPreviewDirective>('DragPreviewDirective');

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[tftDragPreview]',
  standalone: true,
})
export class DragPreviewDirective<T = any> {
  templateRef = inject<TemplateRef<T>>(TemplateRef);

  dragData = input<T>();
}
