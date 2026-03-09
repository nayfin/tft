import { Component } from '@angular/core';
import { FormConfig } from '@tft/crispr-forms';
import { checkboxFormConfig } from './checkbox.config';

@Component({
    selector: 'doc-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    standalone: false
})
export class CheckboxComponent {

  formConfig: FormConfig = checkboxFormConfig;

}
