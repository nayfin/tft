import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { combineLatest, Observable, of, from, forkJoin, Subscription } from 'rxjs';
import { filter, finalize, tap, map, switchMap, mergeMap } from 'rxjs/operators';

export function waitForDownload(): ValidatorFn {
  return (_control: AbstractControl) => {
    console.log('waiting', _control);
    return {waitForDownload: true};
  };
}
@Component({
  selector: 'tft-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnDestroy {
  config: FormConfig = {
    autocomplete: 'off',
    errorDictionary: {
      // required: () => `I am a custom error message on a required field`,
      waitForDownload: (something) => {
        console.log('waiting', {something})
        return 'Files must be down'
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
        // showUploadButton: true,
        showUploadProgress: true,
        validators: [waitForDownload()],
        /**
         * the upload process need to handle a lot in this scenario
         * - start the upload process
         * - update control with upload progress
         * - get download urls from firebase
         * - set control value to paths and urls of uploaded files
         * - clear validators
         * - tell control when download complete
         */
        uploadFiles: (group, files, uploadComponent) => {

          // FileList isn't an array so we have to loop the old fashioned way
          // then we track the paths and uploads to use later
          const uploads: Observable<number>[] = [];
          const paths: string[] = [];
          for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            const path = `examples/${file.name}`
            const uploadRef = this.fireStorage.ref(path);
            const task = uploadRef.put(file);
            // pass percent observable to file progress
            uploadComponent.fileProgress[i] = task.percentageChanges();
            const completed = task.snapshotChanges();

            uploads.push(completed);
            paths.push(path);
          }

          // create subscription for all the things that need to happen during upload
          const uploadSub = combineLatest(uploads).pipe(
            // wait for all the uploads to finish
            filter((tasks: UploadTaskSnapshot[]) => tasks.every(task => task.state === 'success')),
            // firebase storage getDownloadUrl returns a promise so we unwrap the values with switchMap
            switchMap(async(tasks) => {
              const downloadUrlPromises = tasks.map((task) => task.ref.getDownloadURL());
              return await Promise.all(downloadUrlPromises);
            }),
            map((dowloadUrls) => {
              // we want to store the path and the downloadUrl with our data so we map them together here
              return dowloadUrls.map((downloadUrl, i) => ({downloadUrl, gsPath: paths[i]}))
            }),
            tap((fieldValue) => {
              const uploadControl = group.get('fileUploadExample');
              // set the control value
              uploadControl.setValue(fieldValue);
              // clear control validators
              uploadControl.clearValidators();
              console.log('validators', uploadControl.hasError('waitForDownload'))
              // tell the component upload is finished
              uploadComponent.isUploaded = true;
            })
          ).subscribe();
          // track subscription so we can unsubscribe
          this.subs.push(uploadSub);
        }
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
