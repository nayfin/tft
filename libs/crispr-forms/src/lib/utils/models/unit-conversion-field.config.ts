import { FormGroup } from '@angular/forms';
import { FieldDescriptors, MatFieldProperties, CrisprControlConfig, ControlType } from './crispr-field.config';
import { OptionsType } from './select-field.config';

export type UnitConversionFieldConfig<ST = unknown, UT = unknown> = CrisprControlConfig &
  FieldDescriptors &
  MatFieldProperties & {
  controlType: ControlType.UNIT_CONVERSION;


  /**
   * Used convert config value to displayed value on initialization.
   * `value` is passed through as given, so a stored `0` arrives as `0` and a missing value arrives as `null`.
   * Return `null` to leave the display empty, which keeps a missing value `null` (and a `required` field invalid).
   */
  initialDisplayValueConversion: (value?: ST, displayedUnit?: UT) => number | null;
  /**
   * The function to convert the display value into the stored value as the display value changes.
   * Return `null` for an empty display value when `null` (no measurement) and `0` mean different things.
   */
  storedValueConversion: (value?: string, displayedUnit?: UT) => number | null;
  min?: number;
  max?: number;
  autofocus?: boolean;
  step?: number;

} & ({
  showUnitSelect: true
  /**
   * A callback function that returns the options to be used by the unit select field. Can be used just like select field options.
   */
  selectableUnits: (group: FormGroup) => OptionsType,
  /**
   * Display unit to use on component initialization and when unit not user selectable i.e. showUnitSelect: false
   */
   initialDisplayUnit: UT;
} | {
  showUnitSelect: false;
})
