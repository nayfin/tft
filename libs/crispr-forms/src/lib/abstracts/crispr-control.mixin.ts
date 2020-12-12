import { FormGroup, AbstractControl } from '@angular/forms';
import { CrisprControlConfig, ControlValue, ControlType } from '../models';
import { CrisprFieldComponent } from './crispr-field.abstract';

export function crisprControlMixin<C extends CrisprControlConfig>(BaseClass: typeof CrisprFieldComponent) {
  return class extends BaseClass<C> {
    config: C;
    group: FormGroup;
    control: AbstractControl;

    _value: ControlValue | any[];
    set value(value: ControlValue | any[]) {
      this.setControlValue(value);
      this._value = value;
    }

    get value() {
      return this._value;
    }

    ngOnInit() {
      super.ngOnInit();
      this.control = this.group.get(this.config.controlName);
      this.setControlValue(this.value);
      // setTimeouts are ugly but this seems to be the only way to get the computed field to compute initial values
      setTimeout(()=> {
        this.control.updateValueAndValidity();
      })
    }

    setControlValue(value: ControlValue | any[]) {
      if(value && this.control && this.config.controlType !== ControlType.SUB_GROUP) {
        this.control.setValue(value)
      }
    }
  }
}
