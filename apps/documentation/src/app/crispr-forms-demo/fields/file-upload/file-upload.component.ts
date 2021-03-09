import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tft-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  config: FormConfig = {
    autocomplete: 'off',
    errorDictionary: {
      // required: () => `I am a custom error message on a required field`,
    },
    fields: [
      {
        controlType: ControlType.FILE_UPLOAD,
        controlName: 'fileUploadExample',
        allowMultipleFiles: true,
        heading: {
          label: 'Upload Images'
        },
        uploadFile: (group, files, uploadComponent) => {
          for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            const path = `examples/${file.name}`
            const uploadRef = this.fireStorage.ref(path);
            uploadComponent.fileProgress[i] = uploadRef.put(file).percentageChanges().pipe(
              finalize( async() => {
                const downloadUrl = await uploadRef.getDownloadURL().toPromise();
                console.log({path, downloadUrl});
              })
            );
          }
        }
      },
    ]
  }
  constructor(private fireStorage: AngularFireStorage) { }

  handleSubmit(form: FormGroup) {
    console.log({form})
  }
}
