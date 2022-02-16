import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { allowedFileExtValidator, ControlType, FormConfig, maxFileSizeValidator } from '@tft/crispr-forms';

@Component({
  selector: 'tft-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  value = {
    fileUploadExample: {
      downloadUrl :'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg'
    }
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
        mapInputValueToUrl: ((inputValue: {downloadUrl: string}) => {
          // console.log({inputValue})
          return inputValue.downloadUrl
        }),
        heading: {
          label: 'Upload Files'
        },
        appearance: 'standard',
        color: 'accent',
        compressImage: true,
        acceptedTypes: 'image/*',
        targetCompressedImageFileSizeMb: .1,
        // maxWidthOrHeight: 1050,
        minCompressionThresholdMb: .4,
        validators: [
          maxFileSizeValidator(.4),
          allowedFileExtValidator(['svg', 'jpeg', 'jpg', 'png'], false),
          Validators.required]
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT'
      }
    ]
  }

  constructor() { }

  handleSubmit(form: FormGroup) {
    console.log({fieldValue: form.value.fileUploadExample})
  }
}
