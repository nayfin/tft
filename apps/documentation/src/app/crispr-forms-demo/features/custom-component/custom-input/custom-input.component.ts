import { Component, OnInit } from '@angular/core';

import { InputFieldConfig, ControlType, FieldContainerComponent } from '@tft/crispr-forms';
import { CrisprControlComponent } from '@tft/crispr-forms';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';

export interface CustomInputConfig extends Omit<InputFieldConfig, 'controlType'> {
  controlType: ControlType.CUSTOM;
  customConfigProperty?: string;
}

@Component({
    selector: 'doc-custom-input',
    templateUrl: './custom-input.component.html',
    styleUrls: ['./custom-input.component.scss'],
    imports: [FieldContainerComponent, MatFormField, ReactiveFormsModule, MatLabel, MatInput, MatSuffix]
})
export class CustomInputComponent extends CrisprControlComponent<CustomInputConfig> implements OnInit {

  ngOnInit(): void {
    super.ngOnInit();
  }

}
