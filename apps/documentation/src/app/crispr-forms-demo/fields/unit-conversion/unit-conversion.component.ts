import { Component } from '@angular/core';
import { FormConfig, CrisprFormComponent } from '@tft/crispr-forms';
import { unitConversionFormConfig } from './unit-conversion.config';
import { FormGroup } from '@angular/forms';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'tft-unit-conversion',
    templateUrl: './unit-conversion.component.html',
    styleUrls: ['./unit-conversion.component.scss'],
    imports: [MatCard, CrisprFormComponent]
})
export class UnitConversionComponent {
  initialValue = {
    withUnitSelection: 3.76, // meters
    withoutUnitSelection: 25.908, // meters
  };

  formConfig: FormConfig = unitConversionFormConfig;

  submitForm(form: FormGroup) {
    console.log({form})
  }
}
