import { Component } from '@angular/core';
// import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'tft-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  config: FormConfig = {
    autoComplete: 'off',
    errorDictionary: {
      waitForDownload: () => {
        return 'Files must be downloaded';
      }
    },
    fields: [
      {
        controlType: ControlType.FILE_UPLOAD,
        controlName: 'fileUploadExample',
        allowMultipleFiles: true,
        heading: {
          label: 'Upload Images'
        },
        color: 'accent',
        showUploadProgress: true,
        uploadFiles: async (group, files, uploadComponent) => {

          console.log({group, files, uploadComponent})
          // eslint-disable-next-line max-len
          this.snackbar.open('FAKE UPLOAD. Add firebase config and uncomment all firebase imports and usage to upload the files for realsies')
          /**
           * the upload process need to handle a lot in this scenario
           * - start the upload process
           * - update control with upload progress
           * - get download urls from firebase
           * - set control value to paths and urls of uploaded files
           * - clear validators
           * - tell control when download complete
           */
          // // FileList isn't an array so we have to loop the old fashioned way
          // //then we track the paths and uploads to use later
          // const formFieldValue: {downloadUrl: string, firebaseStoragePath: string }[] = []
          // for (let i = 0; i < files.length; i++) {
          //   const file = files.item(i);
          //   const firebaseStoragePath = `examples/${file.name}`
          //   const uploadRef = this.fireStorage.ref(firebaseStoragePath);
          //   const task = uploadRef.put(file);
          //   // pass percent observable to file progress
          //   uploadComponent.fileProgress[i] = task.percentageChanges();

          //   const downloadUrl: string = await task.then(completedTask => completedTask.ref.getDownloadURL());

          //   formFieldValue.push({downloadUrl, firebaseStoragePath})
          // }
          // const uploadControl = group.get('fileUploadExample');
          // // set the control value
          // uploadControl.setValue(formFieldValue);
          // // clear control validators
          // uploadControl.clearValidators();
          // // tell the component upload is finished
          // uploadComponent.isUploaded = true;
        },
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT'
      }
    ]
  }

  constructor(
    // private fireStorage: AngularFireStorage,
    private snackbar: MatSnackBar
  ) { }

  handleSubmit(form: FormGroup) {
    console.log({form})
  }
}
