import { UntypedFormGroup } from '@angular/forms';
import { CrisprControlConfig, ControlType } from '../models';
import { FieldDescriptors, MatFieldProperties } from './crispr-field.config';
import { OptionsType } from './select-field.config';

export type UnitConversionFieldConfig<ST = unknown, UT = unknown> = CrisprControlConfig &
  FieldDescriptors &
  MatFieldProperties & {
  controlType: ControlType.UNIT_CONVERSION;


  /**
   * Used convert config value to displayed value on initialization
   */
  initialDisplayValueConversion: (value?: ST, displayedUnit?: UT) => number;
  /**
   * The function to convert the display value into the stored value as the display value changes
   */
  storedValueConversion: (value?: string, displayedUnit?: UT) => number;
  min?: number;
  max?: number;
  autofocus?: boolean;
  step?: number;

} & ({
  showUnitSelect: true
  /**
   * A callback function that returns the options to be used by the unit select field. Can be used just like select field options.
   */
  selectableUnits: (group: UntypedFormGroup) => OptionsType,
  /**
   * Display unit to use on component initialization and when unit not user selectable i.e. showUnitSelect: false
   */
   initialDisplayUnit: UT;
} | {
  showUnitSelect: false;
})
