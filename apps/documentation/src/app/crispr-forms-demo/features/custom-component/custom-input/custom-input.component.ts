import { Component, OnInit } from '@angular/core';

import { crisprControlMixin, CrisprFieldComponent, InputFieldConfig } from '@tft/crispr-forms';

interface CustomFieldConfig extends InputFieldConfig {
  customConfigProperty?: string;
}

const customComponentMixin = crisprControlMixin<InputFieldConfig>(CrisprFieldComponent);
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
