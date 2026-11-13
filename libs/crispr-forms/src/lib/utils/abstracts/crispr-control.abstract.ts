
import { FormGroup, AbstractControl } from '@angular/forms';
import { CrisprControlConfig, ControlValue, ControlType } from '../models/crispr-field.config';
import { afterNextRender, computed, DestroyRef, Directive, effect, inject, Injector, input, OnInit, output } from '@angular/core';
import { CrisprFieldComponent } from './crispr-field.abstract';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  standalone: true
})
export class CrisprControlComponent<C extends CrisprControlConfig> extends CrisprFieldComponent<C> implements OnInit {
  destroyRef = inject(DestroyRef);
  protected injector = inject(Injector);

  group = input<FormGroup>(null);

  control = computed<AbstractControl>(() => this.group()?.get(this.config().controlName))

  readonly valueChanges = output<ControlValue>();

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
    // Computed fields derive their value from sibling controls, which only exist once the whole form has
    // rendered, so re-run validation (and valueChanges) after the first render to compute initial values.
    afterNextRender(() => {
      this.control().updateValueAndValidity();
    }, { injector: this.injector });
  }

  setControlValue(value: ControlValue) {
    if(value && this.control() && this.config().controlType !== ControlType.SUB_GROUP) {
      this.control().setValue(value)
    }
  }
}

