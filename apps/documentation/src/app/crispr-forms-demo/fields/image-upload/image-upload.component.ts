import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ControlType, FormConfig, maxFileSizeValidator } from '@tft/crispr-forms';

@Component({
  selector: 'tft-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  value = {
    fileUploadExample: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg'
  }
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
        label: 'A Really good label',
        heading: {
          label: 'Upload Files'
        },
        appearance: 'standard',
        color: 'accent',
        compressImage: true,
        acceptedTypes: 'image/*',
        targetCompressedImageFileSizeMb: .1,
        // maxWidthOrHeight: 1050,
        minCompressionThresholdMb: .3,
        validators: [maxFileSizeValidator(.32), Validators.required]
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
