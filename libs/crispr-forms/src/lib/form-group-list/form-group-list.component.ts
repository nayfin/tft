import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import type { FormGroupListConfig } from '../models';
import { createControlForType } from '../form.helpers';
import { CrisprFieldComponent, crisprControlMixin } from '../abstracts';

const defaultConfig: Partial<FormGroupListConfig> = {
  addButtonLabel: 'ADD ITEM',
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
  formArray: FormArray;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    // TODO: this is required to ngFor of controls in template, must be a better way
    this.formArray = this.control as FormArray;
  }

  setControlValue(values: any[]) {
    if(this.control) {
      if(values?.length > 0) {
        values.forEach(value => this.addGroup(value));
        setTimeout(() => {
          this.cdr.detectChanges();
        })

      } else if (this.config.displayInitialItem) {
        this.addGroup()
      }
    }
  }

  addGroup(value = null) {
    this.control.push(createControlForType(this.config.itemConfig, value));
  }

  deleteGroup(index: number) {
    this.control.removeAt(index);
  }
}
