import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ControlFieldConfig } from '../models';
import { Observable, of, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { computeValueFromFields } from '../form.helpers';

@Component({
  selector: 'crispr-field-container',
  templateUrl: './field-container.component.html',
  styleUrls: ['./field-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldContainerComponent implements OnInit, OnDestroy {
  // the configuration object for the field
  @Input() config: ControlFieldConfig;
  // the parent formGroup
  @Input() group: FormGroup;
  // boolean whether field-container is inline
  @Input() inlineField = false;
  // used to determine whether or not field should be shown
  disabledCallback: Observable<boolean>;
  disabled$: Observable<boolean>;
  alignFormWithView$: Observable<boolean>;
  subs: Subscription[] = [];

  constructor() { }

  ngOnInit() {
    this.disabled$ = this.connectDisabledCallback(this.group, this.config);
    // setTimeouts are ugly but this seems to be the only way to get the computed field to compute initial values
    // we tried moving this into afterViewChecked and afterContentChecked lifecycle hooks without any luck
    setTimeout(()=> {
      this.group.get(this.config.controlName).updateValueAndValidity();
    })
    if (this.config.computeFieldConfig) {
      this.subs.push(
        computeValueFromFields(this.group, this.config.computeFieldConfig).pipe(
          tap(computedValue => this.group.get(this.config.controlName).setValue(computedValue))
        ).subscribe(),
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe);
  }
  /**
   * Connects user defined disabledCallback function to the the view, so that the control is enabled/disabled
   * appropriately. It also keeps the form will hide disabled fields in the UI unless `hideDisabled` is set to
   * false in the controls config
   * @param group used to get valueChanges from control
   * @param config configuration object used to
   */
  connectDisabledCallback(group: FormGroup, config: ControlFieldConfig = null) {
    const control = group.get(config.controlName);
    // If the disabled$ function exists on the field config then call it with the disabledCallbackConfig
    // as a parameter otherwise return an observable of true.
    return config.disabledCallback && config.disabledCallback instanceof Function
      ? config.disabledCallback(group, config.disabledCallbackConfig || null).pipe(
        // This enables/disables when callback conditions are met
        tap( (shouldDisable) => shouldDisable ? control.disable() : control.enable())
      )
      : of(false);
  }
}
