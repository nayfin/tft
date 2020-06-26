import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
 import { Observable } from 'rxjs';

import { SelectFieldConfig, SelectOption } from '../../models';
import { observablifyOptions } from '../../form.helpers';
import { CrisprFieldComponent, crisprControlMixin } from '../../field.component.abstract';

const SelectFieldMixin = crisprControlMixin<SelectFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFieldComponent extends SelectFieldMixin implements OnInit {

  options$: Observable<SelectOption[]>;

  constructor() {
    super();
  }
  ngOnInit() {
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config.options, this.group);
  }
}
