import { ModuleWithProviders, NgModule } from '@angular/core';
import { ArrayOfNPipe } from './pipes/array-of-n.pipe';
import { ApplyScaleDirective, DraggableDirective, DragRootDirective, AutoScrollDirective, AccountForScaleDirective, GesturableDirective, ResizableDirective, DropzoneDirective, DragPreviewDirective, LassoDirective } from './directives';
import { InteractRootConfig } from './models';
import { provideInteract } from './provide-interact';

const EXPORTS = [
  DraggableDirective,
  ResizableDirective,
  DropzoneDirective,
  GesturableDirective,
  DragRootDirective,
  AutoScrollDirective,
  AccountForScaleDirective,
  ApplyScaleDirective,
  DragPreviewDirective,
  LassoDirective,
  ArrayOfNPipe,
];

/**
 * @deprecated Import the standalone directives and pipe (DraggableDirective, ResizableDirective, etc.) directly
 * and use `provideInteract()` to configure them. This module will be removed in the next major version.
 */
@NgModule({
  imports: [...EXPORTS],
  exports: [...EXPORTS],
})
export class InteractModule {
  /**
   * @deprecated Use `provideInteract(config)` in your application or route providers.
   */
  static forRoot(config: InteractRootConfig): ModuleWithProviders<InteractModule> {
    return {
      ngModule: InteractModule,
      providers: [provideInteract(config)],
    };
  }
}
