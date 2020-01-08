import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, AfterViewInit, AfterContentChecked } from '@angular/core';
import { CrisprFieldConfig, ControlFieldConfig } from '../models';
import { Observable, of, Subscription } from 'rxjs';
import { FormGroup, AbstractControl } from '@angular/forms';
import { tap, startWith, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'crispr-field-container',
  templateUrl: './field-container.component.html',
  styleUrls: ['./field-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldContainerComponent implements OnInit, OnDestroy, AfterContentChecked {
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

  get hideDisabled() {
    return this.config.hideDisabled === undefined
      ? true
      : this.config.hideDisabled;
  }
  constructor() { }

  ngOnInit() {
    this.disabled$ = this.connectDisabledCallback( this.group, this.config);
    // TODO: try moving this to a different event loop maybe afterViewInit
    // setTimeout(()=> {
    //   this.group.get(this.config.controlName).updateValueAndValidity();
    // })
    if (this.config.computeField && this.config.computeFieldConfig) {
      // if no controlNameToSet is specified use this control's controlName
      // TODO: this might not be the best place to set defaults...
      const computeFieldConfig = {
        controlNameToSet: this.config.controlName,
        ...this.config.computeFieldConfig
      };
      this.subs.push(
        this.config.computeField(this.group, computeFieldConfig).subscribe(),
      );
    }
  }

  ngAfterContentChecked() {
    this.group.get(this.config.controlName).updateValueAndValidity();
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
        // This enables/disables control when when it is shown/hidden keeping form form value inline with view
        tap( (val) => {
          this.alignFormWithView(control)(val);
        })
      )
      : of(false);
  }

  /**
   * We use this function to align the form values with the changes to the view. i.e. when a value is removed from the view.
   * We don't want the form to still emit that value when submitted or throw validation errors on a field that has been removed.
   * @param control the control we want to disable/enable when we are hiding/showing
   */
  alignFormWithView(control: AbstractControl) {
    return ((shouldDisable: boolean) => {
      if (shouldDisable) {
        control.disable();
      } else if (!shouldDisable) {
        control.enable();
      }
    });
  }
}
