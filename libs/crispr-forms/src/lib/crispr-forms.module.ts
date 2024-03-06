import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// custom modules
import { FormValidationHandlerModule } from '@tft/form-validation-handler';

// components
import { CrisprFormComponent } from './form/form.component';
import { FormGroupListComponent } from './form-group-list';
// directives
import { CrisprFieldDirective } from './field.directive';
import { SubGroupModule } from './sub-group';
import { CrisprPipesModule } from './pipes/crispr-pipes.module';
import { FieldContainerComponent } from './ui';
import { CrisprDisplayFieldDirective } from './display-field.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    FormGroupListComponent,
    FieldContainerComponent,
    CrisprFieldDirective,
    CrisprDisplayFieldDirective,
    SubGroupModule,
    CrisprPipesModule,
    CrisprFormComponent,
  ],
  exports: [CrisprFormComponent, FieldContainerComponent],
})
export class CrisprFormsModule {}
