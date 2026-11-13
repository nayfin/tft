import { Component } from '@angular/core';
import { FormConfig, CrisprFormComponent } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';
import { inputFormConfig } from './input.config';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'doc-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    imports: [MatCard, CrisprFormComponent]
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
