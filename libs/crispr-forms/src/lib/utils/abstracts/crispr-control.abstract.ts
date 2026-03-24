
import { FormGroup, AbstractControl } from '@angular/forms';
import { CrisprControlConfig, ControlValue, ControlType } from '../models/crispr-field.config';
import { computed, DestroyRef, Directive, effect, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { CrisprFieldComponent } from './crispr-field.abstract';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  standalone: true
})
export class CrisprControlComponent<C extends CrisprControlConfig> extends CrisprFieldComponent<C> implements OnInit {
  destroyRef = inject(DestroyRef);

  group = input<FormGroup>(null);

  control = computed<AbstractControl>(() => this.group()?.get(this.config().controlName))

  @Output() valueChanges: EventEmitter<ControlValue> = new EventEmitter<ControlValue>();

  value = input<ControlValue>(null);

  constructor() {
    super();
    effect(() => {
      this.setControlValue(this.value())
    })
  }
  
  ngOnInit() {
    this.control().valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((value: ControlValue) => {
      this.valueChanges.emit(value);
    });
    // setTimeouts are ugly but this seems to be the only way to get the computed field to compute initial values
    setTimeout(()=> {
      this.control().updateValueAndValidity();
    })
  }

  setControlValue(value: ControlValue) {
    if(value && this.control() && this.config().controlType !== ControlType.SUB_GROUP) {
      this.control().setValue(value)
    }
  }
}

