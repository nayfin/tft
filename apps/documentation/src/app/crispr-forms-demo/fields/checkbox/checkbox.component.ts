import { Component } from '@angular/core';
import { FormConfig, CrisprFormComponent } from '@tft/crispr-forms';
import { checkboxFormConfig } from './checkbox.config';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'doc-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    imports: [MatCard, CrisprFormComponent]
})
export class CheckboxComponent {

  formConfig: FormConfig = checkboxFormConfig;

}
