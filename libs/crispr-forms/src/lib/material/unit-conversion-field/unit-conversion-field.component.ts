import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { FieldContainerModule } from '../../field-container';
import { observablifyOptions } from '../../form.helpers';
import { SelectOption } from '../../models';
import { UnitConversionFieldConfig } from '../../models/unit-conversion-field.config';
import { InfoModule } from '../info/info.component';
import { OptionModule } from '../option';

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
    // TODO: Validators need work. validation is tricky because the input needs to be validated against but the validator will compare against the controls value
    // this.displayValueControl.setValidators(this.config.validators);

    const controlValuePipeline: Observable<string>[] = [
      this.displayValueControl.valueChanges.pipe(startWith(this.displayValueControl.value))
    ];
    // setup all required pieces when showing a field for selecting units
    if (this.config.showUnitSelect) {
      this.unitOptions$ = observablifyOptions(this.config.selectableUnits, this.group)
      controlValuePipeline.push(this.unitSelectControl.valueChanges.pipe(startWith(this.config?.initialDisplayUnit || null)));
      this.unitSelectControl.setValue(this.config?.initialDisplayUnit || null);
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

  /**
   * We override the 'setControlValue' we inherited from crisprControlMixin and add our custom logic,
   * This function gets called onInit because were object oriented. it's so great, so great that I'm
   * typing a paragraph to explain what the hell is going on...
   * @param value the initial value for the control passed down from the form components input
   */
  setControlValue(value) {
    const initialUnitValue = this.config.showUnitSelect ? this.config?.initialDisplayUnit : null;
    this.setInitialDisplayValue(value, initialUnitValue);
  }
}
@NgModule({
  imports: [
    CommonModule,
    InfoModule,
    OptionModule,
    ReactiveFormsModule,
    FieldContainerModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  exports: [
    UnitConversionFieldComponent
  ],
  declarations: [
    UnitConversionFieldComponent
  ]
})
export class UnitConversionFieldModule {
}
