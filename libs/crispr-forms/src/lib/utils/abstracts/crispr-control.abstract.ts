
import { FormGroup, AbstractControl } from '@angular/forms';
import { CrisprControlConfig, ControlValue, ControlType } from '../models/crispr-field.config';
import { afterNextRender, computed, DestroyRef, Directive, effect, inject, Injector, input, OnInit, output, signal } from '@angular/core';
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

  /**
   * Bumped on every event of the control (value, status, touched, pristine). The state signals below read it, so
   * a template that reads them re-renders when the form changes the control from outside the template (a parent
   * `patchValue`, `markAsTouched`, `setErrors` or an async validator finishing), which `control().valid` alone
   * does not do in an OnPush or zoneless component.
   */
  private readonly controlEventCount = signal(0);
  /** Whether the control is valid. Reactive, so it is safe to read in a template. */
  readonly controlValid = computed(() => {
    this.controlEventCount();
    return this.control()?.valid ?? true;
  });
  /** Whether the control has been touched. Reactive, so it is safe to read in a template. */
  readonly controlTouched = computed(() => {
    this.controlEventCount();
    return this.control()?.touched ?? false;
  });
  /** Whether the field's hint is shown: while the control is valid, or the user has not touched it yet. */
  readonly hintVisible = computed(() => this.controlValid() || !this.controlTouched());

  value = input<ControlValue>(null);

  constructor() {
    super();
    effect(() => {
      this.setControlValue(this.value())
    })
  }
  
  ngOnInit() {
    this.control().events.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => this.controlEventCount.update((count) => count + 1));
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

