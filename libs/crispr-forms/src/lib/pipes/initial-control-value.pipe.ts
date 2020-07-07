import { Pipe, PipeTransform } from '@angular/core';
import { ControlValue, AnyFieldConfig } from '../models';
import { isControlConfig } from '../form.helpers';

@Pipe({
  name: 'initialControlValue'
})
export class InitialControlValuePipe implements PipeTransform {

  transform(initialFormValue: {[key: string]: ControlValue | any}, fieldConfig: AnyFieldConfig): unknown {
    return initialFormValue && isControlConfig(fieldConfig)
      ? initialFormValue[fieldConfig.controlName]
      : null;
  }

}
