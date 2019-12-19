import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { FormGroupListConfig } from '../models';
import { createControlForType } from '../form.helpers';

@Component({
  selector: 'crispr-form-group-list',
  templateUrl: './form-group-list.component.html',
  styleUrls: ['./form-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupListComponent implements OnInit {

  config: FormGroupListConfig;
  group: FormGroup;
  addItemLabel: string;
  formArray: FormArray;
  minListLength: number;

  ngOnInit() {
    this.addItemLabel = this.config.addItemLabel || 'ADD ITEM';
    this.minListLength = Number.isInteger(this.config.minListLength) ? this.config.minListLength : 1;
    this.formArray = this.getFormArray(this.group, this.config.controlName);
  }

  getFormArray(group: FormGroup, controlName: string): FormArray {
    return group.get(controlName) as FormArray;
  }

  addGroup(value = null) {
    this.formArray.push( createControlForType(this.config.itemConfig, value) );
  }

  deleteGroup(index: number) {
    this.formArray.removeAt(index);
  }
}


