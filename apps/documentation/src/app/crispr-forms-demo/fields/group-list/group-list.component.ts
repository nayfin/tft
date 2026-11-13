import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormConfig, CrisprFormComponent } from '@tft/crispr-forms';
import {
  groupListFormConfig,
  groupListInitialValue,
} from './group-list.config';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'doc-group-list',
    templateUrl: './group-list.component.html',
    imports: [MatCard, CrisprFormComponent],
})
export class GroupListComponent {
  config: FormConfig = groupListFormConfig;
  value = groupListInitialValue;

  handleSubmit(form: FormGroup) {
    console.log({ form });
  }
}
