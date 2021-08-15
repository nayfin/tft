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
    if (this.config.showUnitSelect) {
      this.unitOptions$ = observablifyOptions(this.config.selectableUnits, this.group)
      this.unitSelectControl.setValue(this.config?.initialDisplayUnit || null);
    }

    const controlValuePipeline: Observable<string>[] = [
      this.displayValueControl.valueChanges,
      ...(this.config.showUnitSelect ? [this.unitSelectControl.valueChanges.pipe(startWith(this.config.initialDisplayUnit))] : [])
    ];

    combineLatest(controlValuePipeline).subscribe(([displayValue, unitValue] )=> {
      const computedValue = this.config.storedValueConversion(displayValue, unitValue);
      this.control.setValue(computedValue);
    });

    const initialUnitValue = this.config.showUnitSelect ? this.config?.initialDisplayUnit : null;
    this.setInitialDisplayValue(initialUnitValue);
  }

  setInitialDisplayValue(unit: unknown) {
    const initialDisplayValue = this.config.initialDisplayValueConversion(this.value || null, unit);
    this.displayValueControl.setValue(initialDisplayValue);
  }

}
