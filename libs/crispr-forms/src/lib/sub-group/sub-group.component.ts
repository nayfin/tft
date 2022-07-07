import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { crisprControlMixin, CrisprFieldComponent, SubGroupConfig } from '@tft/crispr-forms/utils';

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
  group: FormGroup;

  ngOnInit() {
    super.ngOnInit();
  }
}
