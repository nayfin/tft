import { MatButtonModule } from '@angular/material/button';
import { FieldContainerModule } from '../field-container';
import { MatIconModule } from '@angular/material/icon';
import { CrisprFieldModule } from '../field.directive';
import { CrisprPipesModule } from '../pipes/crispr-pipes.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroupListComponent } from './form-group-list.component';
import { CommonModule } from '@angular/common';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FieldContainerModule,
    ReactiveFormsModule,
    CrisprFieldModule,
    CrisprPipesModule,
    FormValidationHandlerModule
  ],
  exports: [
    FormGroupListComponent
  ],
  declarations: [
    FormGroupListComponent
  ]
})

export class FormGroupListModule {
}
