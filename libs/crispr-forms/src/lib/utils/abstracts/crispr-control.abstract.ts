
import { FormGroup, AbstractControl } from '@angular/forms';
import { CrisprControlConfig, ControlValue, ControlType } from '../models/crispr-field.config';
import { Directive, effect, Input, OnInit, signal } from '@angular/core';
import { CrisprFieldComponent } from './crispr-field.abstract';

@Directive({
  standalone: true
})
export class CrisprControlComponent<C extends CrisprControlConfig> extends CrisprFieldComponent<C> implements OnInit {
  group = signal<FormGroup>(null);
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({alias: 'group'})
  set inputGroup(group: ControlValue) {
    console.log('set group', group);
    this.group.set(group);
  }

  control: AbstractControl;

  value = signal<ControlValue>(null); 
  /*
    * Having the input alias allows us to consume these components in the traditional Angular way as well as progammatically in the form builder
    */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({alias: 'value'}) 
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
    this.control = this.group().get(this.config().controlName);
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

