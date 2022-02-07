import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'tft-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {

  config: FormConfig = {
    autoComplete: 'off',
    errorDictionary: {
      waitForDownload: () => {
        return 'Files must be downloaded';
      }
    },
    fields: [
      {
        controlType: ControlType.IMAGE_UPLOAD,
        controlName: 'fileUploadExample',
        allowMultipleFiles: true,
        heading: {
          label: 'Upload Files'
        },
        color: 'accent',
        // showUploadProgress: true,
        // uploadFiles: async (group, files, uploadComponent) => {

        //   console.log({group, files, uploadComponent})
        //   // eslint-disable-next-line max-len
        //   // this.snackbar.open('FAKE UPLOAD. Add firebase config and uncomment all firebase imports and usage to upload the files for realsies')

        // },
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT'
      }
    ]
  }

  constructor() { }

  handleSubmit(form: FormGroup) {
    console.log({form})
  }
}
