import { Component } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'tft-unit-conversion',
  templateUrl: './unit-conversion.component.html',
  styleUrls: ['./unit-conversion.component.scss']
})
export class UnitConversionComponent {


  formConfig: FormConfig = {
    autocomplete: 'off',
    fields: [
      {
        controlType: ControlType.UNIT_CONVERSION,
        label: 'Text Input Field',
        controlName: 'textInput',
        storedUnit: 'm',
        initialDisplayedUnit: 'ft',
        selectableUnits: (group) => {
          console.log({group})
          return [
          {value: 'in', label: 'inch'},
          {value: 'ft', label: 'feet'},
          {value: 'yd', label: 'yard'},
        ]},
        initialDisplayValueConversion: (value, displayedUnit) => {
          console.log('initialDisplayValueConversion', value, displayedUnit);
          return value * 10
        },
        storedValueConversion: (value, displayedUnit ) => {
          console.log('initialDisplayValueConversion', value, displayedUnit);
          return value / 10
        }
      },
    ]
  }


}
