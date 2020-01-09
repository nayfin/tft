import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { of, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'doc-disabled-field',
  templateUrl: './disabled-field.component.html',
  styleUrls: ['./disabled-field.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
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
        label: 'Dynamically disabled field',
        hideDisabled: false, // default value
        disabledCallback: (group) => {
          return group.get('enabler').valueChanges.pipe(map(value => value !== 'enable'))
        }
      }
    ]
  };

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
        label: 'Dynamically disabled field',
        hideDisabled: true,
        disabledCallback: (group) => {
          return group.get('enabler').valueChanges.pipe(map(value => value !== 'enable'))
        }
      }
    ]
  }

  complexHiddenFieldConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'hiddenFieldDemo',
    fields: [
      {
        controlType: ControlType.SELECT,
        controlName: 'enablerA',
        label: 'We can enable/disable the following field',
        options: [
          {label: 'Disable', value: 'disable'},
          {label: 'Enable', value: 'enable'}
        ]
      },
      {
        controlType: ControlType.SELECT,
        controlName: 'enablerB',
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
        label: 'Dynamically disabled field',
        info: {
          content: `Set either of the above fields to 'Enable' to enable me`
        },
        disabledCallback: (group) => {
          return combineLatest([
            group.get('enablerA').valueChanges,
            group.get('enablerB').valueChanges
          ]).pipe(
            map(([enablerA, enablerB]) => {
              console.log({enablerA, enablerB})
              return enablerA !== 'enable' && enablerB !== 'enable'
            })
          );
        }
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
