import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, tap, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tft-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnDestroy {
  config: FormConfig = {
    autocomplete: 'off',
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
        /**
         * the upload process need to handle a lot in this scenario
         * - start the upload process
         * - update control with upload progress
         * - get download urls from firebase
         * - set control value to paths and urls of uploaded files
         * - clear validators
         * - tell control when download complete
         */
        uploadFiles: async (group, files, uploadComponent) => {

          // FileList isn't an array so we have to loop the old fashioned way
          // then we track the paths and uploads to use later
          const formFieldValue: {downloadUrl: string, firebaseStoragePath: string }[] = []
          for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            const firebaseStoragePath = `examples/${file.name}`
            const uploadRef = this.fireStorage.ref(firebaseStoragePath);
            const task = uploadRef.put(file);
            // pass percent observable to file progress
            uploadComponent.fileProgress[i] = task.percentageChanges();

            const downloadUrl: string = await task.then(completedTask => completedTask.ref.getDownloadURL());

            formFieldValue.push({downloadUrl, firebaseStoragePath})
          }
          const uploadControl = group.get('fileUploadExample');
          // set the control value
          uploadControl.setValue(formFieldValue);
          // clear control validators
          uploadControl.clearValidators();
          // tell the component upload is finished
          uploadComponent.isUploaded = true;
          // create subscription for all the things that need to happen during upload
          // const uploadSub = combineLatest(uploads).pipe(
          //   // wait for all the uploads to finish
          //   filter((tasks: UploadTaskSnapshot[]) => {
          //     console.log({tasks})
          //     return tasks.every(task => task.state === 'success')
          //   }),
          //   // firebase storage getDownloadUrl returns a promise so we unwrap the values with switchMap
          //   switchMap(async(tasks) => {
          //     const downloadUrlPromises = tasks.map((task) => task.ref.getDownloadURL());
          //     return await Promise.all(downloadUrlPromises);
          //   }),
          //   map((dowloadUrls) => {
          //     // we want to store the path and the downloadUrl with our data so we map them together here
          //     return dowloadUrls.map((downloadUrl, i) => ({downloadUrl, gsPath: paths[i]}))
          //   }),
          //   tap((fieldValue) => {
          //     const uploadControl = group.get('fileUploadExample');
          //     // set the control value
          //     uploadControl.setValue(fieldValue);
          //     // clear control validators
          //     uploadControl.clearValidators();
          //     console.log('validators', uploadControl.hasError('waitForDownload'))
          //     // tell the component upload is finished
          //     uploadComponent.isUploaded = true;
          //   })
          // ).subscribe();
          // track subscription so we can unsubscribe
          // this.subs.push(uploadSub);
        },
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT'
      }
    ]
  }

  subs: Subscription[] = [];

  constructor(private fireStorage: AngularFireStorage) { }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  handleSubmit(form: FormGroup) {
    console.log({form})
  }
}
