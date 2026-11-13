import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SubGroupConfig } from '../utils';
import { CrisprControlComponent } from '../utils/abstracts/crispr-control.abstract';
import { CrisprFieldDirective } from '../field.directive';
import { InitialControlValuePipe } from '../pipes/initial-control-value.pipe';
import { FieldContainerComponent } from '../ui/field-container';

@Component({
    selector: 'crispr-sub-group',
    templateUrl: './sub-group.component.html',
    styleUrls: ['./sub-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      ReactiveFormsModule,
      CrisprFieldDirective,
      FieldContainerComponent,
      InitialControlValuePipe
    ],
})
export class SubGroupComponent extends CrisprControlComponent<SubGroupConfig> implements OnInit {
  
  ngOnInit() {
    super.ngOnInit();
  }
}
