import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { FormGroupListConfig } from '../models';
import { createControlForType } from '../form.helpers';
import { CrisprFieldComponent } from '../abstracts';

const defaultConfig: Partial<FormGroupListConfig> = {
  addItemLabel: 'ADD ITEM',
  minListLength: 1,
};

@Component({
  selector: 'crispr-form-group-list',
  templateUrl: './form-group-list.component.html',
  styleUrls: ['./form-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupListComponent extends CrisprFieldComponent<FormGroupListConfig> implements OnInit {
  defaultConfig = defaultConfig
  group: FormGroup;
  formArray: FormArray;

  ngOnInit() {
    super.ngOnInit();
    this.formArray = this.getFormArray(this.group, this.config.controlName);
    const initialValue = this.config.initialValue;
    if(initialValue ) {
      initialValue.forEach(value => this.addGroup(value));
    } else if (this.config.minListLength > 0) {
      this.addGroup()
    }
  }

  getFormArray(group: FormGroup, controlName: string): FormArray {
    return group.get(controlName) as FormArray;
  }

  addGroup(value = null) {
    this.formArray.push(createControlForType(this.config.itemConfig, value) );
  }

  deleteGroup(index: number) {
    this.formArray.removeAt(index);
  }
}


