import { Component } from '@angular/core';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'doc-custom-component',
  templateUrl: './custom-component.component.html',
  styleUrls: ['./custom-component.component.scss']
})
export class CustomComponentComponent {

  customComponentConfig: FormConfig = {
    autocomplete: 'off',
    fields: [
      {
        component: CustomInputComponent,
        inputType: 'number',
        controlName: 'customComponent',
        label: 'This is a label on a custom component ',
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT'
      }
    ]
  }

  handleSubmit(form: FormGroup) {
    console.log(form.value);
  }

}
