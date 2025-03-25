/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { OptionComponent } from '../option';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import { InfoComponent } from '../info';
import {
  observablifyOptions,
  SelectOption,
  UnitConversionFieldConfig,
} from '../../utils';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

const defaultConfig: Partial<UnitConversionFieldConfig> = {};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'crispr-unit-conversion-field',
  templateUrl: './unit-conversion-field.component.html',
  styleUrls: ['./unit-conversion-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InfoComponent,
    OptionComponent,
    ReactiveFormsModule,
    FieldContainerComponent,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormValidationHandlerModule,
  ],
})
export class UnitConversionFieldComponent
  extends CrisprControlComponent<UnitConversionFieldConfig>
  implements OnInit, OnDestroy
{
  defaultConfig = defaultConfig;

  displayValueControl = new FormControl();
  unitSelectControl = new FormControl();
  unitOptions$: Observable<SelectOption[]>;

  transformationSubscription: Subscription;

  ngOnInit() {
    const config = this.config();
    super.ngOnInit();
    // TODO: Validators need work. validation is tricky because the input needs to be validated against but the validator will compare against the controls value
    // this.displayValueControl.setValidators(this.config.validators);

    const controlValuePipeline: Observable<string>[] = [
      this.displayValueControl.valueChanges.pipe(
        startWith(this.displayValueControl.value)
      ),
    ];
    // setup all required pieces when showing a field for selecting units
    if (config.showUnitSelect === true) {
      this.unitOptions$ = observablifyOptions(
        config.selectableUnits,
        this.group()
      );
      controlValuePipeline.push(
        this.unitSelectControl.valueChanges.pipe(
          startWith(config?.initialDisplayUnit || null)
        )
      );
      this.unitSelectControl.setValue(config?.initialDisplayUnit || null);
    }

    this.transformationSubscription = combineLatest(
      controlValuePipeline
    ).subscribe(([displayValue, unitValue]) => {
      const computedValue = this.config().storedValueConversion(
        displayValue,
        unitValue
      );
      this.control.setValue(computedValue);
    });
  }

  ngOnDestroy() {
    this.transformationSubscription.unsubscribe();
  }

  setInitialDisplayValue(storedValue: any, unit: unknown) {
    const initialDisplayValue = this.config().initialDisplayValueConversion(
      storedValue || null,
      unit
    );
    this.displayValueControl.setValue(initialDisplayValue);
  }

  /**
   * We override the 'setControlValue' we inherited from crisprControlMixin and add our custom logic,
   * This function gets called onInit because were object oriented. it's so great, so great that I'm
   * typing a paragraph to explain what the hell is going on...
   * @param value the initial value for the control passed down from the form components input
   */
  setControlValue(value) {
    const config = this.config();
    const initialUnitValue = config.showUnitSelect
      ? config?.initialDisplayUnit
      : null;
    this.setInitialDisplayValue(value, initialUnitValue);
  }
}
