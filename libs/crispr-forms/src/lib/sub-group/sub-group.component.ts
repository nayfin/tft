import { ChangeDetectionStrategy, Component, OnInit, computed } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  /** The sub group's control, typed for the nested `[group]` binding. */
  readonly subGroup = computed(() => this.control() as FormGroup);

  ngOnInit() {
    super.ngOnInit();
  }
}
