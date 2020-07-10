import { Component, OnInit } from '@angular/core';
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
        controlName: 'factorA',
        label: 'This number is multiplied by the next value ',
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
