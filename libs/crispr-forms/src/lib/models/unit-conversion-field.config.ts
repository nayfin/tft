import { FormGroup } from '@angular/forms';
import { CrisprControlConfig, ControlType } from '../models';
import { FieldDescriptors, MatFieldProperties } from './crispr-field.config';
import { OptionsType } from './select-field.config';

export interface UnitConversionFieldConfig<T = string> extends CrisprControlConfig,
  FieldDescriptors,
  MatFieldProperties {
  controlType: ControlType.UNIT_CONVERSION;
  selectableUnits: (group: FormGroup) => OptionsType,
  initialDisplayedUnit: T;
  storedUnit: T;
  /**
   * Used convert config value to displayed value on initialization
   */
  initialDisplayValueConversion: (value: number, displayedUnit: T, storedUnit?: T) => number;
  /**
   * The function to convert the display value into the stored value as the display value changes
   */
  storedValueConversion: (value: number, displayedUnit: T, storedUnit?: T) => number;
  min?: number;
  max?: number;
  autofocus?: boolean;
  autoComplete?: 'off' | 'on';
  step?: number;
}
