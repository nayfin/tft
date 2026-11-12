import { Component, signal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { allowedFileExtValidator, ControlType, FormConfig, ImageProcessingState, maxFileSizeValidator } from '@tft/crispr-forms';
import { delay, of, startWith } from 'rxjs';

@Component({
    selector: 'tft-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
    standalone: false
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
        appearance: 'outline',
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

  /** Records every processing state change along with the form status at the time of the callback */
  processingLog = signal<{ state: ImageProcessingState; formStatus: string }[]>([]);

  /** Records every `filesChanged` call as `<file name>:<file size>` */
  filesChangedLog = signal<string[]>([]);

  /** Whether the processing form is rendered, removing it while an image is compressing exercises field destruction */
  showProcessingForm = signal(true);

  /** A tiny 1x1 png, used as the initial value so that no network request is needed */
  private initialImageUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  initialImageValue = { initialImage: this.initialImageUrl };

  initialImageConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.IMAGE_UPLOAD,
        controlName: 'initialImage',
        label: 'Image with an initial value',
        acceptedTypes: 'image/*',
        compressImage: true,
        targetCompressedImageFileSizeMb: 0.05,
        minCompressionThresholdMb: 0.05,
        useWebWorker: false,
      },
    ],
  };

  processingConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.IMAGE_UPLOAD,
        controlName: 'processedImage',
        label: 'Image with processing state',
        acceptedTypes: 'image/*',
        compressImage: true,
        // thresholds are kept low so that a modest image gets compressed
        targetCompressedImageFileSizeMb: 0.05,
        minCompressionThresholdMb: 0.05,
        // avoids the web worker script which is loaded from a CDN
        useWebWorker: false,
        filesChanged: (_group, file) => {
          this.filesChangedLog.update((log) => [...log, `${file.name}:${file.size}`]);
        },
        processingStateChange: (state, group) => {
          this.processingLog.update((log) => [...log, { state, formStatus: group.status }]);
        },
      },
    ],
  };

  constructor() { }

  handleSubmit(form: FormGroup) {
    console.log({fieldValue: form.value.fileUploadExample})
  }
}
