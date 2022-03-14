import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { allowedFileExtValidator, ControlType, FormConfig, maxFileSizeValidator } from '@tft/crispr-forms';
import { delay, of, startWith } from 'rxjs';

@Component({
  selector: 'tft-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  value = of({
    fileUploadExample: {
      downloadUrl :'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg'
    },
    image: {
      location: {
        downloadUrl :'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg'
      }
    }
  }).pipe(
    delay(2000),
    startWith({
      fileUploadExample: {
        downloadUrl : ''
      },
      image: {
        location: {
          downloadUrl : ''
        }
      }
    })
  )
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
          console.log({inputValue})
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
        controlType: ControlType.SUB_GROUP,
        controlName: 'image',
        fields: [
          {
            controlType: ControlType.IMAGE_UPLOAD,
            controlName: 'location',
            label: 'Image of feature',
            acceptedTypes: 'image/jpeg, image/bmp, image/png, image/gif',
            mapInputValueToUrl: (value: {downloadUrl: string, path: string}) => {
              console.log({value})
              return value.downloadUrl;
            },
            validators: [
              maxFileSizeValidator(8),
              allowedFileExtValidator(['svg', 'jpeg', 'jpg', 'png'], false),
            ]
          },
        ]
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
