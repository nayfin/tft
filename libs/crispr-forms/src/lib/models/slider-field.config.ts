import { ControlFieldConfig, ControlType } from '../models';
export interface SliderFieldConfig extends ControlFieldConfig {
  controlType: ControlType.SLIDER;
  initialValue?: number;
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
