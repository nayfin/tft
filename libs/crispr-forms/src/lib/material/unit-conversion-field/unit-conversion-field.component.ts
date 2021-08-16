import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { observablifyOptions } from '../../form.helpers';
import { SelectOption } from '../../models';
import { UnitConversionFieldConfig } from '../../models/unit-conversion-field.config';

const defaultConfig: Partial<UnitConversionFieldConfig> = {};
const UnitConversionFieldMixin = crisprControlMixin<UnitConversionFieldConfig>(CrisprFieldComponent);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'crispr-unit-conversion-field',
  templateUrl: './unit-conversion-field.component.html',
  styleUrls: ['./unit-conversion-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitConversionFieldComponent extends UnitConversionFieldMixin implements OnInit, OnDestroy {
  defaultConfig = defaultConfig;

  displayValueControl = new FormControl();
  unitSelectControl = new FormControl();
  unitOptions$: Observable<SelectOption[]>;

  transformationSubscription: Subscription;

  ngOnInit() {
    super.ngOnInit();
    // TODO: Fix it
    // this.displayValueControl.setValidators(this.config.validators);
    this.control.clearValidators();
    const controlValuePipeline: Observable<string>[] = [
      this.displayValueControl.valueChanges,
    ];
    // setup all required pieces when showing a field for selecting units
    if (this.config.showUnitSelect) {
      this.unitOptions$ = observablifyOptions(this.config.selectableUnits, this.group)
      this.unitSelectControl.setValue(this.config?.initialDisplayUnit || null);
      controlValuePipeline.push(this.unitSelectControl.valueChanges.pipe(startWith(this.config.initialDisplayUnit)));
    }

    this.transformationSubscription = combineLatest(controlValuePipeline).subscribe(([displayValue, unitValue] )=> {
      const computedValue = this.config.storedValueConversion(displayValue, unitValue);
      this.control.setValue(computedValue);
    });
  }

  ngOnDestroy() {
    this.transformationSubscription.unsubscribe();
  }

  setInitialDisplayValue(storedValue: any, unit: unknown) {
    const initialDisplayValue = this.config.initialDisplayValueConversion(storedValue || null, unit);
    this.displayValueControl.setValue(initialDisplayValue);
  }

  // We override the 'setControlValue' we inherited from crisprControlMixin and add our custom logic
  setControlValue(value) {
    const initialUnitValue = this.config.showUnitSelect ? this.config?.initialDisplayUnit : null;
    this.setInitialDisplayValue(value, initialUnitValue);
  }
}
