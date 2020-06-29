import { ControlFieldConfig, ControlValue, CrisprFieldConfig } from './models';
import { OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

// export type Constructor<T> = new(...args: any[]) => T;

export abstract class CrisprFieldComponent<C extends CrisprFieldConfig> implements OnInit {
  config: C;
  protected defaultConfig?: Partial<C>

  ngOnInit() {
    this.applyDefaultConfig();
  }

  applyDefaultConfig() {
    this.config = this.defaultConfig ? {...this.defaultConfig, ...this.config} : this.config;
  }
}

export function crisprControlMixin<C extends ControlFieldConfig>(BaseClass: typeof CrisprFieldComponent) {
  return class extends BaseClass<C> {
    config: C;
    group: FormGroup;
    control: FormControl;

    specializedValueSetter: (value: ControlValue) => void;

    ngOnInit() {
      super.ngOnInit();
      this.control = this.group.get(this.config.controlName) as FormControl;
      this.setControlValue(this.config.value);
    }

    setControlValue(value: ControlValue) {
      if(value) {
        this.control.setValue(value)
        if(this.specializedValueSetter) {
          this.specializedValueSetter(value);
        }
      }
    }
  }
}

// export abstract class AbstractControlComponent<T> extends CrisprFieldComponent<T> implements OnInit {
//   config: ControlFieldConfig & T;
//   group: FormGroup;
//   control: FormControl;

//   specializedValueSetter: (value: ControlValue) => void;

//   ngOnInit() {
//     this.control = this.group.get(this.config.controlName) as FormControl;
//     this.setControlValue(this.config.value);
//   }

//   setControlValue(value: ControlValue) {
//     if(value) {
//       this.control.setValue(value)
//       if(this.specializedValueSetter) {
//         this.specializedValueSetter(value);
//       }
//     }
//   }

// }
