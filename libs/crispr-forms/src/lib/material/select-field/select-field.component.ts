import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, NgModule } from '@angular/core';
 import { Observable } from 'rxjs';

import { SelectFieldConfig, SelectOption } from '../../models';
import { observablifyOptions } from '../../form.helpers';
import { CrisprFieldComponent, crisprControlMixin } from '../../abstracts';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { InfoModule } from '../info/info.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { CrisprFieldModule } from '../../field.directive';
import { FieldContainerModule } from '../../field-container';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OptionModule } from '../option';

const SelectFieldMixin = crisprControlMixin<SelectFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFieldComponent extends SelectFieldMixin implements OnInit, AfterViewInit {
  defaultConfig = {
    enableToggleAll: false,
    color: 'primary' as ThemePalette
  };
  options$: Observable<SelectOption[]>;
  allSelected = false;

  @ViewChild('selectField') selectField: MatSelect;

  ngOnInit() {
    super.ngOnInit();
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config.options, this.group);
  }

  ngAfterViewInit() {
    if (
      this.config.multiple
      && this.config.enableToggleAll
      && this.selectField.options?.length === (this.value as any[])?.length
    ) {
      this.allSelected = true;
    }
  }

  toggleAll(isSelected: boolean) {
    if ( isSelected ) {
      this.selectField.options.forEach(option => option.deselect());
    } else {
      this.selectField.options.forEach(option => option.select());
    }
    this.allSelected = !this.allSelected;
  }
}
@NgModule({
  imports: [
    CommonModule,
    InfoModule,
    OptionModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    CrisprFieldModule,
    FieldContainerModule,
    MatFormFieldModule,
  ],
  exports: [
    SelectFieldComponent
  ],
  declarations: [
    SelectFieldComponent
  ]
})

export class SelectFieldModule {
}
