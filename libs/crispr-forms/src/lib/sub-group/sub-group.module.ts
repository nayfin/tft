import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrisprFieldDirective } from '../field.directive';
import { CrisprPipesModule } from '../pipes/crispr-pipes.module';
import { SubGroupComponent } from './sub-group.component';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '@tft/crispr-forms/ui';
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
