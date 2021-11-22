import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayOfNPipe } from './pipes/array-of-n.pipe';
import { ApplyScaleDirective, DraggableDirective, DragRootDirective, AccountForScaleDirective, GesturableDirective, ResizableDirective, DropzoneDirective, DragPreviewDirective } from './directives';
import { InteractService } from './services/interact.service';
import { InteractRootConfig, INTERACT_ROOT_CONFIG } from './models';



const EXPORTS = [
  DraggableDirective,
  ResizableDirective,
  DropzoneDirective,
  GesturableDirective,
  DragRootDirective,
  AccountForScaleDirective,
  ApplyScaleDirective,
  DragPreviewDirective,
  ArrayOfNPipe,
];


@NgModule({
  imports: [CommonModule],
  // providers: [{ provide: INTERACT_ROOT_CONFIG, useValue: 'px' }],
  declarations: [
    ...EXPORTS,
  ],
  exports: [
    ...EXPORTS
  ]
})
export class InteractModule {
  static forRoot(config: InteractRootConfig): ModuleWithProviders<InteractModule> {
    const defaultConfig: InteractRootConfig = {cssDimensionUnit: 'px'}
    return {
      ngModule: InteractModule,
      providers: [
        { provide: INTERACT_ROOT_CONFIG, useValue: {...defaultConfig, ...config} },
        InteractService
      ]
    };
  }
}
