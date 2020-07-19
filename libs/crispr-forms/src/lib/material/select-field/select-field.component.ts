import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
 import { Observable } from 'rxjs';

import { SelectFieldConfig, SelectOption } from '../../models';
import { observablifyOptions } from '../../form.helpers';
import { CrisprFieldComponent, crisprControlMixin } from '../../abstracts';
import { MatSelect } from '@angular/material/select';
import { ThemePalette } from '@angular/material/core';

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
