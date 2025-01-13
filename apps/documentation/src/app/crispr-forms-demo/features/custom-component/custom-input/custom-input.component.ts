import { Component, OnInit } from '@angular/core';

import { InputFieldConfig, ControlType } from '@tft/crispr-forms';
import { CrisprControlComponent } from '@tft/crispr-forms';

export interface CustomInputConfig extends Omit<InputFieldConfig, 'controlType'> {
  controlType: ControlType.CUSTOM;
  customConfigProperty?: string;
}

@Component({
  selector: 'doc-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss']
})
export class CustomInputComponent extends CrisprControlComponent<CustomInputConfig> implements OnInit {

  ngOnInit(): void {
    super.ngOnInit();
  }

}
