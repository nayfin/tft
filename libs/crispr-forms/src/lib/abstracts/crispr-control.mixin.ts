import { FormGroup, FormControl } from '@angular/forms';
import { ControlFieldConfig, ControlValue } from '../models';
import { CrisprFieldComponent } from './crispr-field.abstract';

export function crisprControlMixin<C extends ControlFieldConfig>(BaseClass: typeof CrisprFieldComponent) {
  return class extends BaseClass<C> {
    config: C;
    group: FormGroup;
    control: FormControl;

    specializedValueSetter: (value: ControlValue | any[]) => void;

    ngOnInit() {
      super.ngOnInit();
      this.control = this.group.get(this.config.controlName) as FormControl;
      this.setControlValue(this.config.initialValue);
    }

    setControlValue(value: ControlValue | any[]) {
      if(value) {
        this.control.setValue(value)
        if(this.specializedValueSetter) {
          this.specializedValueSetter(value);
        }
      }
    }
  }
}
