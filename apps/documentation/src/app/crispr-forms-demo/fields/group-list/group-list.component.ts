import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormConfig } from '@tft/crispr-forms';
import {
  groupListFormConfig,
  groupListInitialValue,
} from './group-list.config';

@Component({
  selector: 'doc-group-list',
  templateUrl: './group-list.component.html',
  standalone: false,
})
export class GroupListComponent {
  config: FormConfig = groupListFormConfig;
  value = groupListInitialValue;

  handleSubmit(form: FormGroup) {
    console.log({ form });
  }
}
