import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrisprFieldDirective } from '../field.directive';
import { FieldContainerComponent } from '../field-container';
import { CrisprPipesModule } from '../pipes/crispr-pipes.module';
import { SubGroupComponent } from './sub-group.component';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
@NgModule({
  imports: [
    CommonModule,
    CrisprFieldDirective,
    FieldContainerComponent,
    CrisprPipesModule,
    // TODO: Does this need to be here?
    FormValidationHandlerModule
  ],
  exports: [
    SubGroupComponent
  ],
  declarations: [
    SubGroupComponent
  ]
})

export class SubGroupModule {
}
