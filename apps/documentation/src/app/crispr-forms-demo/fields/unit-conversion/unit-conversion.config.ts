import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';
import qty from 'js-quantities';

export const unitConversionFormConfig: FormConfig = {
  autoComplete: 'off',
  fields: [
    {
      controlType: ControlType.UNIT_CONVERSION,
      label: 'Length (with unit selection)',
      controlName: 'withUnitSelection',
      showUnitSelect: true,
      initialDisplayUnit: 'ft',
      validators: [Validators.required],
      selectableUnits: () => [
        { value: 'in', label: 'inch' },
        { value: 'ft', label: 'feet' },
        { value: 'yd', label: 'yard' },
      ],
      initialDisplayValueConversion: (value, displayedUnit) =>
        value ? qty(`${value} m`).to(displayedUnit).scalar : 0,
      storedValueConversion: (value, displayedUnit) =>
        qty(`${value} ${displayedUnit}`).to('m').scalar,
    },
    {
      controlType: ControlType.UNIT_CONVERSION,
      label: 'Length (feet, stored as meters)',
      controlName: 'withoutUnitSelection',
      showUnitSelect: false,
      fieldSuffix: 'feet',
      validators: [Validators.required],
      initialDisplayValueConversion: (value) =>
        value ? qty(`${value} m`).to('ft').scalar : 0,
      storedValueConversion: (value) =>
        qty(`${value} ft`).to('m').scalar,
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
    },
  ],
};
