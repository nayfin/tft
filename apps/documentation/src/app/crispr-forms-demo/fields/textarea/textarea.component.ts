import { Component } from '@angular/core';
import { FormConfig } from '@tft/crispr-forms';
import { textareaFormConfig } from './textarea.config';

@Component({
    selector: 'doc-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss'],
    standalone: false
})
export class TextareaComponent {

  formConfig: FormConfig = textareaFormConfig;

}
