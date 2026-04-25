import { Component } from '@angular/core';
import { FormConfig } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';
import { inputFormConfig } from './input.config';

@Component({
    selector: 'doc-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    standalone: false
})
export class InputComponent {

  formConfig: FormConfig = inputFormConfig;
  initialValue = {
    numberInput: 0.5
  }
  handleSubmit(form: FormGroup) {
    console.log({form})
  }

}
