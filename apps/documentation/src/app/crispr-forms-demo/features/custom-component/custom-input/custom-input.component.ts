import { Component, OnInit } from '@angular/core';

import { crisprControlMixin, CrisprFieldComponent, InputFieldConfig, ControlType } from '@tft/crispr-forms';

export interface CustomInputConfig extends Omit<InputFieldConfig, 'controlType'> {
  controlType: ControlType.CUSTOM;
  customConfigProperty?: string;
}

const customComponentMixin = crisprControlMixin<CustomInputConfig>(CrisprFieldComponent);
@Component({
  selector: 'doc-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss']
})
export class CustomInputComponent extends customComponentMixin implements OnInit {

  ngOnInit(): void {
    super.ngOnInit();
  }

}
