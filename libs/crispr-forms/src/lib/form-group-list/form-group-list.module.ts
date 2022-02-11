import { MatButtonModule } from '@angular/material/button';
import { FieldContainerModule } from '../field-container';
import { MatIconModule } from '@angular/material/icon';
import { CrisprFieldModule } from '../field.directive';
import { CrisprPipesModule } from '../pipes/crispr-pipes.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroupListComponent } from './form-group-list.component';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    FieldContainerModule,
    ReactiveFormsModule,
    CrisprFieldModule,
    CrisprPipesModule
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
