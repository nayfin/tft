import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { FormGroupListConfig } from '../models';
import { createControlForType } from '../form.helpers';
import { CrisprFieldComponent, crisprControlMixin } from '../abstracts';

const defaultConfig: Partial<FormGroupListConfig> = {
  addItemLabel: 'ADD ITEM',
  minListLength: 1,
};

const FormGroupListMixin = crisprControlMixin<FormGroupListConfig>(CrisprFieldComponent);
@Component({
  selector: 'crispr-form-group-list',
  templateUrl: './form-group-list.component.html',
  styleUrls: ['./form-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupListComponent extends FormGroupListMixin implements OnInit {
  defaultConfig = defaultConfig
  group: FormGroup;
  control: FormArray;
  value: any[]; // TODO: not sure how to strongly type this yet

  ngOnInit() {
    super.ngOnInit();
  }

  setControlValue(values: any[]) {
    if(values && this.control) {
      values.forEach(value => this.addGroup(value));
    } else if (this.config.minListLength > 0) {
      this.addGroup()
    }
  }

  getFormArray(): FormArray {
    return this.control as FormArray;
  }

  addGroup(value = null) {
    this.control.push(createControlForType(this.config.itemConfig, value));
  }

  deleteGroup(index: number) {
    this.control.removeAt(index);
  }
}


