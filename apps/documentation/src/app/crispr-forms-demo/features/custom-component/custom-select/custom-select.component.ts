import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectFieldConfig, SelectOption, observablifyOptions, CrisprFieldComponent, crisprControlMixin, ControlType } from '@tft/crispr-forms';

export interface CustomSelectConfig extends Omit<SelectFieldConfig, 'controlType'> {
  controlType: ControlType.CUSTOM;
  customSelectProperty?: string;
}

const SelectFieldMixin = crisprControlMixin<CustomSelectConfig>(CrisprFieldComponent);

@Component({
  selector: 'doc-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectComponent extends SelectFieldMixin implements OnInit {
  defaultConfig = {};
  options$: Observable<SelectOption[]>;
  ngOnInit() {
    super.ngOnInit();
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config.options, this.group);
  }
}

