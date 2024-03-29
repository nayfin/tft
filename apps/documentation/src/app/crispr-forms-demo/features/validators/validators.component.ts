import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConfig, ControlType } from '@tft/crispr-forms';
import { someControlIsValid } from '@tft/form-validation-handler';
import { map } from 'rxjs';

@Component({
  selector: 'tft-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css']
})
export class ValidatorsComponent {
  formConfig: FormConfig = {
    validators: [someControlIsValid(['length', 'cost', 'formattedName'])],
    fields: [
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'length',
        validators: [Validators.required],
        label: 'Length of table',
        heading: {
          label: `'primary'`,
          typographyClass: 'mat-h2'
        },
        fieldSuffix: 'meters',
        color: 'primary',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'conditionallyDisabledField',
        validators: [Validators.required],
        label: 'Conditionally Disabled Field',
        heading: {
          label: `'primary'`,
          typographyClass: 'mat-h2'
        },
        fieldSuffix: 'meters',
        color: 'primary',
        hideDisabled: true,
        disabledCallback: (group) => {
          const lengthControl = group.get('length') as FormControl;
          return lengthControl.valueChanges.pipe(
            map((lengthVal: number) => {
              const invalid = !(lengthVal && lengthVal > 1)
              return invalid;
            })
          )
        }
      },
      {
        controlType: ControlType.INPUT,
        validators: [Validators.required],
        inputType: 'number',
        controlName: 'cost',
        label: 'Cost of table',
        heading: {
          label: `'accent'`,
          typographyClass: 'mat-h2'
        },
        fieldSuffix: '.00'
      },
      {
        controlType: ControlType.TEXTAREA,
        validators: [Validators.minLength(2), Validators.required],
        controlName: 'formattedName',
        label: 'Formatted Name',
        heading: {
          label: `'warn'`,
          typographyClass: 'mat-h2'
        },
        color: 'warn',
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT'
      }
    ]
  }

  handleSubmit(form: FormGroup) {
    console.log({isValid: form.valid, form})
  }
}
