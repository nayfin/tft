import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'doc-computed-field',
  templateUrl: './computed-field.component.html',
  styleUrls: ['./computed-field.component.scss']
})
export class ComputedFieldComponent implements OnInit {
  computedNumberFieldConfig: FormConfig = {
    autocomplete: 'off',
    fields: [
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'factorA',
        label: 'This number is multiplied by the next value ',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'factorB',
        label: 'Change me to see the next value change',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'product',
        label: 'I am a computed value',
        computeFieldConfig: {
          controlNamesToWatch: ['factorA', 'factorB'],
          computeCallback: (fieldValues: number[]) => {
            console.log(fieldValues);
            const [factorA, factorB] = fieldValues;
            return factorA * factorB;
          }
        },
        // computeField: computeValueFromFields
      }
    ]
  }

  computedStringFieldConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'firstName',
        label: 'First Name',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'lastName',
        label: 'Last Name',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'formattedName',
        label: 'Formatted Name',
        computeFieldConfig: {
          controlNamesToWatch: ['firstName', 'lastName'],
          computeCallback: (values: string[]) => {
            console.log({values})
            return `${values[0] || ''} ${values[1] || ''}`.trim();
          }
        },
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
