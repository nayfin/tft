import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectFieldConfig, SelectOption, observablifyOptions, ControlType, CrisprControlComponent, FieldContainerComponent } from '@tft/crispr-forms';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

export interface CustomSelectConfig extends Omit<SelectFieldConfig, 'controlType'> {
  controlType: ControlType.CUSTOM;
  customSelectProperty?: string;
}

@Component({
    selector: 'doc-custom-select',
    templateUrl: './custom-select.component.html',
    styleUrls: ['./custom-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FieldContainerComponent, MatFormField, ReactiveFormsModule, MatLabel, MatSelect, MatOption, MatSuffix, AsyncPipe]
})
export class CustomSelectComponent extends CrisprControlComponent<SelectFieldConfig> implements OnInit {
  defaultConfig = {};
  options$: Observable<SelectOption[]>;
  ngOnInit() {
    super.ngOnInit();
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config().options, this.group());
  }
}

