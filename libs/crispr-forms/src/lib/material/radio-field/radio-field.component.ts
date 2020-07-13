import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
 import { Observable } from 'rxjs';

import { SelectOption } from '../../models';
import { observablifyOptions } from '../../form.helpers';
import { CrisprFieldComponent, crisprControlMixin } from '../../abstracts';
import { RadioFieldConfig } from '../../models/radio-field.config';

const RadioFieldMixin = crisprControlMixin<RadioFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-radio-field',
  templateUrl: './radio-field.component.html',
  styleUrls: ['./radio-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioFieldComponent extends RadioFieldMixin implements OnInit {
  defaultConfig = {};
  options$: Observable<SelectOption[]>;
  ngOnInit() {
    super.ngOnInit();
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config.options, this.group);
  }
}
