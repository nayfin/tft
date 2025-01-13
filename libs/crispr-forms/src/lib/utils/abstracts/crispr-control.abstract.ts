
import { FormGroup, AbstractControl } from '@angular/forms';
import { CrisprControlConfig, ControlValue, ControlType } from '../models/crispr-field.config';
import { Directive, effect, Input, OnInit, signal } from '@angular/core';
import { CrisprFieldComponent } from './crispr-field.abstract';

@Directive({
  standalone: true
})
export class CrisprControlComponent<C extends CrisprControlConfig> extends CrisprFieldComponent<C> implements OnInit {
    group: FormGroup;
    control: AbstractControl;

    value = signal<ControlValue>(null); 

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input({alias: 'valueinput'}) 
    set inputValue(value: ControlValue) {
      this.value.set(value);
    }

    constructor() {
      super();
      effect(() => {
        const value = this.value();
        this.setControlValue(value)
      })

    }
    
    ngOnInit() {
      this.control = this.group.get(this.config().controlName);
      // this.setControlValue(this.value);
      // setTimeouts are ugly but this seems to be the only way to get the computed field to compute initial values
      setTimeout(()=> {
        this.control.updateValueAndValidity();
      })
    }

    setControlValue(value: ControlValue) {
      if(value && this.control && this.config().controlType !== ControlType.SUB_GROUP) {
        this.control.setValue(value)
      }
    }
  }

