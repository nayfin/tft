import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormConfig } from '@tft/crispr-forms';
import { fileUploadFormConfig } from './file-upload.config';

@Component({
    selector: 'tft-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    standalone: false
})
export class FileUploadComponent {
  config: FormConfig = fileUploadFormConfig;

  handleSubmit(form: FormGroup) {
    console.log({ form });
  }
}
