import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

import { FormGroupListConfig } from './form-group-list.config';
import { createControlForType } from '../form.helpers';
import { FieldContainerComponent } from '../field-container/field-container.component';

@Component({
  selector: 'crispr-form-group-list',
  templateUrl: './form-group-list.component.html',
  styleUrls: ['./form-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupListComponent extends FieldContainerComponent implements OnInit {

  config: FormGroupListConfig;
  group: FormGroup;
  addItemLabel: string;
  formArray: FormArray;
  minListLength: number;

  constructor() {
    super();
  }

  ngOnInit() {
    this.showField = this.connectShowField(this.group, this.config);

    this.addItemLabel = this.config.addItemLabel || 'ADD ITEM';
    this.minListLength = Number.isInteger(this.config.minListLength) ? this.config.minListLength : 1;
    this.formArray = this.getFormArray(this.group, this.config.controlName);
    const initialListItemCount = isNaN(this.config.initialListItemCount) ? 1 : this.config.initialListItemCount;
    for (let itemIndex = 0; itemIndex < initialListItemCount; itemIndex++) {
      this.addGroup();
    }
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


