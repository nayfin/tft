import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SubGroupConfig } from '../models';
import { crisprControlMixin, CrisprFieldComponent } from '../abstracts';

const FormGroupMixin = crisprControlMixin<SubGroupConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-sub-group',
  templateUrl: './sub-group.component.html',
  styleUrls: ['./sub-group.component.scss'],
  // TODO: child image upload controls aren't getting updated appropriately when in OnPush strategy.
  // We can add cdr to this class, but everything that extends it will need the cdr attached
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubGroupComponent extends FormGroupMixin implements OnInit {
  group: UntypedFormGroup;

  ngOnInit() {
    super.ngOnInit();
  }
}
