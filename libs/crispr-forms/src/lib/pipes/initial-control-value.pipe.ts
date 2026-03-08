import { Pipe, PipeTransform } from '@angular/core';
import {
  ControlValue,
  AnyFieldConfig,
  isControlConfig,
} from '../utils';

@Pipe({
    name: 'initialControlValue',
    standalone: false
})
export class InitialControlValuePipe implements PipeTransform {
  // TODO: does changing any to unknown break anything?
  transform(
    initialFormValue: { [key: string]: ControlValue | any },
    fieldConfig: AnyFieldConfig
  ): unknown {
    return initialFormValue && isControlConfig(fieldConfig)
      ? initialFormValue[fieldConfig.controlName] || null
      : null;
  }
}
