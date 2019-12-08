import { CrisprFieldConfig } from '../models';
// TODO: We may not need this
export interface SliderFieldConfig extends CrisprFieldConfig {
  displayWith?: (value: number) => string | number;
  invert?: boolean;
  displayLimits?: boolean;
  max?: number;
  min?: number;
  step?: number;
  thumbLabel?: boolean;
  tickInterval?: number | "auto"
  vertical?: boolean
}
