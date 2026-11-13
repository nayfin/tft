import { Component, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileUploadFieldConfig, FormConfig, CrisprFormComponent } from '@tft/crispr-forms';
import { fileUploadFormConfig } from './file-upload.config';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'tft-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    imports: [MatCard, CrisprFormComponent]
})
export class FileUploadComponent {
  /** Records every `filesChanged` call as the comma separated names of the selected files */
  filesChangedLog = signal<string[]>([]);

  config: FormConfig = {
    ...fileUploadFormConfig,
    fields: [
      {
        ...(fileUploadFormConfig.fields[0] as FileUploadFieldConfig),
        filesChanged: (_group: FormGroup, files: FileList) =>
          this.filesChangedLog.update((log) => [
            ...log,
            Array.from(files)
              .map((file) => file.name)
              .join(','),
          ]),
      },
      ...fileUploadFormConfig.fields.slice(1),
    ],
  };

  handleSubmit(form: FormGroup) {
    console.log({ form });
  }
}
