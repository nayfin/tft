import { CrisprControlConfig, ControlType } from '../models';
import { FieldDescriptors, MatFieldProperties } from './crispr-field.config';
export interface SliderFieldConfig extends
  CrisprControlConfig,
  Pick<FieldDescriptors, 'label' | 'info'>,
  Pick<MatFieldProperties, 'color'>
  {
  controlType: ControlType.SLIDER;
  displayWith?: (value: number) => string | number;
  invert?: boolean;
  displayLimits?: boolean;
  max?: number;
  min?: number;
  step?: number;
  thumbLabel?: boolean;
  tickInterval?: number | 'auto';
  vertical?: boolean;
}
