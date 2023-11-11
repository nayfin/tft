import { FieldDescriptors, MatFieldProperties, CrisprControlConfig, ControlType } from './crispr-field.config';
export interface SliderFieldConfig extends
  CrisprControlConfig,
  Pick<FieldDescriptors, 'label' | 'info'>,
  Pick<MatFieldProperties, 'color'>
  {
  controlType: ControlType.SLIDER;
  displayWith?: (value: number) => string | number;
  max?: number;
  min?: number;
  step?: number;
  discrete?: boolean;
  tickInterval?: number | 'auto';
  displayLimits?: boolean;
  vertical?: boolean;
  // invert?: boolean;
}
