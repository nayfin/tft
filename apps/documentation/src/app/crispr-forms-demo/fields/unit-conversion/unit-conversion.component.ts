import { Component } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import qty from 'js-quantities';
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
          if (value) {
            const initialQty = qty(`${value} m`).to(displayedUnit).toString();
            console.log('initialDisplayValueConversion', initialQty, value, displayedUnit);
            return initialQty
          } else {
            return 0;
          }
        },
        storedValueConversion: (value, displayedUnit ) => {
          const num = parseFloat(value);
          const storedValue = qty(`${value} ${displayedUnit}`).to('m').toString();
          console.log('initialDisplayValueConversion', num, displayedUnit, storedValue);
          return storedValue;
        }
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT',
        callback: (group) => { console.log({value: group.value})}
      }
    ]
  }


}
