import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SubGroupConfig } from '../utils';
import { CrisprControlComponent } from '../utils/abstracts/crispr-control.abstract';
import { CrisprFieldDirective } from '../field.directive';
import { CrisprPipesModule } from '../pipes/crispr-pipes.module';
import { FieldContainerComponent } from '../ui/field-container';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';

@Component({
    selector: 'crispr-sub-group',
    templateUrl: './sub-group.component.html',
    styleUrls: ['./sub-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      CrisprFieldDirective,
      FieldContainerComponent,
      CrisprPipesModule,
      FormValidationHandlerModule,
    ],
})
export class SubGroupComponent extends CrisprControlComponent<SubGroupConfig> implements OnInit {
  
  ngOnInit() {
    super.ngOnInit();
  }
}
