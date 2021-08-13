import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
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
export class UnitConversionFieldComponent extends UnitConversionFieldMixin implements OnInit {
  defaultConfig = defaultConfig;

  displayValueControl = new FormControl();
  unitSelectControl = new FormControl();
  unitOptions$: Observable<SelectOption[]>;

  ngOnInit() {
    super.ngOnInit();
    // TODO: Fix it
    // this.displayValueControl.setValidators(this.config.validators);
    this.unitOptions$ = observablifyOptions(this.config.selectableUnits, this.group)
    this.unitSelectControl.setValue(this.config.initialDisplayedUnit);
    combineLatest([
      this.displayValueControl.valueChanges,
      this.unitSelectControl.valueChanges.pipe(startWith(this.config.initialDisplayedUnit))
    ])
    .subscribe(([displayValue, unitValue] )=> {
      const computedValue = this.config.storedValueConversion(displayValue, unitValue);
      console.log({computedValue});
      this.control.setValue(computedValue);
    });
    this.setInitialDisplayValue();
  }

  setInitialDisplayValue() {
    const initialDisplayValue = this.config.initialDisplayValueConversion(this.value || null, this.config.initialDisplayedUnit);
    this.displayValueControl.setValue(initialDisplayValue);
  }



}
