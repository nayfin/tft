import { FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { ControlFieldConfig, ControlValue } from '../models';
import { CrisprFieldComponent } from './crispr-field.abstract';

export function crisprControlMixin<C extends ControlFieldConfig>(BaseClass: typeof CrisprFieldComponent) {
  return class extends BaseClass<C> {
    config: C;
    group: FormGroup;
    control: AbstractControl;

    _value: ControlValue | any[];
    set value(value: ControlValue | any[]) {
      this.setControlValue(value);
      this._value = value;
    };

    get value() {
      return this._value;
    }

    ngOnInit() {
      super.ngOnInit();
      this.control = this.group.get(this.config.controlName);
      this.setControlValue(this.value);
    }

    setControlValue(value: ControlValue | any[]) {
      if(value && this.control) {
        this.control.setValue(value)
      }
    }
  }
}
