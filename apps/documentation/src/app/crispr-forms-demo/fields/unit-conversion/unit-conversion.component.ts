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
        label: 'Unit Conversion Field with unit selection',
        controlName: 'withUnitSelection',
        initialDisplayUnit: 'ft',
        showUnitSelect: true,
        selectableUnits: (_group) => {
          return [
          {value: 'in', label: 'inch'},
          {value: 'ft', label: 'feet'},
          {value: 'yd', label: 'yard'},
        ]},
        initialDisplayValueConversion: (value, displayedUnit) => {
          if (value) {
            console.log({displayedUnit})
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
        controlType: ControlType.UNIT_CONVERSION,
        label: 'Unit Conversion Field without unit selection field',
        controlName: 'withoutUnitSelection',
        showUnitSelect: false,
        initialDisplayValueConversion: (value) => {
          if (value) {
            const initialQty = qty(`${value} m`).to('ft').toString();
            console.log('initialDisplayValueConversion', initialQty, value);
            return initialQty
          } else {
            return 0;
          }
        },
        storedValueConversion: (value ) => {
          const num = parseFloat(value);
          const storedValue = qty(`${value} ft`).to('m').toString();
          console.log('initialDisplayValueConversion', num, storedValue);
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
