import { Component } from '@angular/core';
import { CustomInputComponent, CustomInputConfig } from './custom-input/custom-input.component';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';
import { CustomSelectComponent, CustomSelectConfig } from './custom-select/custom-select.component';


@Component({
  selector: 'doc-custom-component',
  templateUrl: './custom-component.component.html',
  styleUrls: ['./custom-component.component.scss']
})
export class CustomComponentComponent {

  customComponentConfig: FormConfig<CustomInputConfig | CustomSelectConfig> = {
    autoComplete: 'off',
    fields: [
      {
        component: CustomInputComponent,
        controlType: ControlType.CUSTOM,
        inputType: 'number',
        controlName: 'customComponent',
        label: 'This is a label on a custom component ',
        customConfigProperty: `I'm a custom property. Mathmatical!`
      },
      {
        component: CustomSelectComponent,
        customSelectProperty: 'stuff',
        controlName: 'customComponent',
        label: 'This is a label on a custom component ',
        customConfigProperty: `I'm a custom property. Mathmatical!`
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT',
      }
    ]
  }

  handleSubmit(form: FormGroup) {
    console.log(form.value);
  }

}
