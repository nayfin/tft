import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doc-disabled-field',
  templateUrl: './disabled-field.component.html',
  styleUrls: ['./disabled-field.component.scss']
})
export class DisabledFieldComponent implements OnInit {

  disabledFieldConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'disabledFieldDemo',
    fields: [
      {
        controlType: ControlType.SELECT,
        controlName: 'enabler',
        label: 'We can enable/disable the following field',
        options: [
          {label: 'Disable', value: 'disable'},
          {label: 'Enable', value: 'enable'}
        ]
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'dynamicallyDisabled',
        label: 'Formatted Name',
        // true by default
        hideDisabled: false,
        disabledCallback: (group) => {
          return group.get('enabler').valueChanges.pipe(map(value => value !== 'enable'))
        }
      }
    ]
  }

  hiddenFieldConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'hiddenFieldDemo',
    fields: [
      {
        controlType: ControlType.SELECT,
        controlName: 'enabler',
        label: 'We can enable/disable the following field',
        options: [
          {label: 'Disable', value: 'disable'},
          {label: 'Enable', value: 'enable'}
        ]
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'dynamicallyDisabled',
        label: 'Formatted Name',
        disabledCallback: (group) => {
          return group.get('enabler').valueChanges.pipe(map(value => value !== 'enable'))
        }
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
