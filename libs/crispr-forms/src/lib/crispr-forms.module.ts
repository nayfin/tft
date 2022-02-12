import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// custom modules
import { MaterialModule } from './material/material.module'

import { FormValidationHandlerModule } from '@tft/form-validation-handler';

// components
import { CrisprFormComponent } from './form/form.component';
import { FormGroupListComponent } from './form-group-list/form-group-list.component';
// directives
import { CrisprFieldDirective } from './field.directive';
import { InitialControlValuePipe } from './pipes/initial-control-value.pipe';
import { SubGroupComponent } from './sub-group/sub-group.component';
import { FieldContainerComponent } from '..';
// import { FieldContainerModule } from './field-container/field-container.component';

@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormValidationHandlerModule,
      // FieldContainerModule,
      MaterialModule
    ],
    declarations: [
      FieldContainerComponent,
      CrisprFieldDirective,
      CrisprFormComponent,
      FormGroupListComponent,
      InitialControlValuePipe,
      SubGroupComponent,
    ],
    exports: [
      CrisprFormComponent,
      MaterialModule,
      FieldContainerComponent
    ]
})
export class CrisprFormsModule { }
