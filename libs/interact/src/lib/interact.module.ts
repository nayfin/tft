import { ModuleWithProviders, NgModule } from '@angular/core';
import { ArrayOfNPipe } from './pipes/array-of-n.pipe';
import { ApplyScaleDirective, DraggableDirective, DragRootDirective, AutoScrollDirective, AccountForScaleDirective, GesturableDirective, ResizableDirective, DropzoneDirective, DragPreviewDirective, LassoDirective } from './directives';
import { InteractService } from './services/interact.service';
import { InteractRootConfig, INTERACT_ROOT_CONFIG } from './models';

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
 * @deprecated Import the standalone directives and pipe (DraggableDirective, ResizableDirective, etc.) directly.
 * This module will be removed in the next major version.
 * `InteractModule.forRoot()` is still supported for providing InteractService configuration; the
 * equivalent without the module is to provide `INTERACT_ROOT_CONFIG` and `InteractService` yourself.
 */
@NgModule({
  imports: [...EXPORTS],
  exports: [...EXPORTS],
})
export class InteractModule {
  static forRoot(config: InteractRootConfig): ModuleWithProviders<InteractModule> {
    const defaultConfig: InteractRootConfig = { cssDimensionUnit: 'px' };
    return {
      ngModule: InteractModule,
      providers: [
        { provide: INTERACT_ROOT_CONFIG, useValue: { ...defaultConfig, ...config } },
        InteractService,
      ],
    };
  }
}
