import { Component } from '@angular/core';
import { FormConfig, CrisprFormComponent } from '@tft/crispr-forms';
import { MatCard } from '@angular/material/card';
import { radioFormConfig, radioInitialValue } from './radio.config';

@Component({
  selector: 'doc-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  imports: [MatCard, CrisprFormComponent],
})
export class RadioComponent {
  formConfig: FormConfig = radioFormConfig;
  initialValue = radioInitialValue;
}
