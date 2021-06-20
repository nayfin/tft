import { Component } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doc-computed-field',
  templateUrl: './computed-field.component.html',
  styleUrls: ['./computed-field.component.scss']
})
export class ComputedFieldComponent {
  computedNumberFieldConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'factorA',
        label: 'This number is multiplied by the next value ',
        autoComplete: 'off',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'factorB',
        label: 'Change me to see the next value change',
        autoComplete: 'off',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'product',
        label: 'I am a computed value',
        // // DEPRECATED: EXAMPLE OF old way of computing fields
        // computeFieldConfig: {
        //   controlNamesToWatch: ['factorA', 'factorB'],
        //   computeCallback: (fieldValues: number[]) => {
        //     console.log(fieldValues);
        //     const [factorA, factorB] = fieldValues;
        //     return factorA * factorB;
        //   }
        // },
        computeValue: (group) => {
          return combineLatest([
            group.get('factorA').valueChanges,
            group.get('factorB').valueChanges
          ]).pipe(
            map(([factorA, factorB]) => factorA * factorB)
          )
        }
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
        spellcheck: true,
        autoComplete: 'off',
        autoCapitalize: 'off',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'lastName',
        label: 'Last Name',
        autoComplete: 'off',
        autoCapitalize: 'off'
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'formattedName',
        label: 'Formatted Name',
        // // DEPRECATED: EXAMPLE OF old way of computing fields
        // computeFieldConfig: {
        //   controlNamesToWatch: ['firstName', 'lastName'],
        //   computeCallback: (values: string[]) => {
        //     console.log({values})
        //     return `${values[0] || ''} ${values[1] || ''}`.trim();
        //   }
        // },
        computeValue: (group) => {
          return combineLatest([
            group.get('firstName').valueChanges,
            group.get('lastName').valueChanges
          ]).pipe(
            map(([firstName, lastName]) => `${firstName || ''} ${lastName || ''}`)
          )
        }
      }
    ]
  }
}
