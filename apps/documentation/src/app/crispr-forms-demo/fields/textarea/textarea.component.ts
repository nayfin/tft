import { Component } from '@angular/core';
import { FormConfig, CrisprFormComponent } from '@tft/crispr-forms';
import { textareaFormConfig } from './textarea.config';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'doc-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss'],
    imports: [MatCard, CrisprFormComponent]
})
export class TextareaComponent {

  formConfig: FormConfig = textareaFormConfig;

}
