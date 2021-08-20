import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import qty from 'js-quantities';
@Component({
  selector: 'tft-unit-conversion',
  templateUrl: './unit-conversion.component.html',
  styleUrls: ['./unit-conversion.component.scss']
})
export class UnitConversionComponent {
  // initial stored value to pass to configuration
  initialValue = {
    withUnitSelection: 3.6576, // meters
    withoutUnitSelection: 25.908, // meters
    subGroupedConvertor: {
      withoutUnitSelection: 5.908,
      autocompleteTest: {label: 'abc', value: 'abc'},
      inputTest: 'hello'
    }
  }

  formConfig: FormConfig = {
    autocomplete: 'off',
    fields: [
      {
        controlType: ControlType.UNIT_CONVERSION,
        label: 'Unit Conversion Field with unit selection',
        controlName: 'withUnitSelection',
        initialDisplayUnit: 'ft',
        showUnitSelect: true,
        validators: [Validators.required, Validators.max(3)],
        selectableUnits: (_group) => {
          return [
          {value: 'in', label: 'inch'},
          {value: 'ft', label: 'feet'},
          {value: 'yd', label: 'yard'},
        ]},
        initialDisplayValueConversion: (value, displayedUnit) => {
          if (value) {
            console.log({displayedUnit})
            const initialQty = qty(`${value} m`).to(displayedUnit).scalar;
            console.log('initialDisplayValueConversion', initialQty, value, displayedUnit);
            return initialQty
          } else {
            return 0;
          }
        },
        storedValueConversion: (value, displayedUnit ) => {
          const num = parseFloat(value);
          const storedValue = qty(`${value} ${displayedUnit}`).to('m').scalar;
          console.log('initialDisplayValueConversion', num, displayedUnit, storedValue);
          return storedValue;
        }
      },
      {
        controlType: ControlType.UNIT_CONVERSION,
        label: 'Unit Conversion Field without unit selection field',
        controlName: 'withoutUnitSelection',
        showUnitSelect: false,
        validators: [Validators.required, Validators.max(3)],
        fieldSuffix: 'feet',
        initialDisplayValueConversion: (value) => {
          if (value) {
            const initialQty = qty(`${value} m`).to('ft').scalar;
            console.log('initialDisplayValueConversion', initialQty, value);
            return initialQty;
          } else {
            return 0;
          }
        },
        storedValueConversion: (value) => {
          const num = parseFloat(value);
          const storedValue = qty(`${value} ft`).to('m').scalar;
          console.log('storedValueConversion', num, storedValue);
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
