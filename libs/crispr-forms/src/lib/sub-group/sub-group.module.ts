import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrisprFieldModule } from '../field.directive';
import { FieldContainerModule } from '../field-container';
import { CrisprPipesModule } from '../pipes/crispr-pipes.module';
import { SubGroupComponent } from './sub-group.component';
@NgModule({
  imports: [
    CommonModule,
    CrisprFieldModule,
    FieldContainerModule,
    CrisprPipesModule
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
