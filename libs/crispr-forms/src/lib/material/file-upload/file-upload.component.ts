import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { FileUploadFieldConfig } from '../../models/file-upload-field.config';

const FileUploadFieldMixin = crisprControlMixin<FileUploadFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent extends FileUploadFieldMixin implements OnInit {

  defaultConfig: Partial<FileUploadFieldConfig> = {
    allowMultipleFiles: false,
    showDeleteButton: true,
    showUploadProgress: false,
    acceptedTypes: '*.*',
    dropZoneText: 'DROP FILE HERE',
    selectButtonText: 'SELECT FILE',
    uploadButtonText: 'UPLOAD FILE',
    selectFilesButtonType: 'button',
    uploadButtonType: 'button',
    disableOnUpload: true
  }

  @ViewChild('fileInput') fileInputRef: ElementRef

  selectedFiles: FileList;

  isUploaded = false;

  fileProgress: Observable<number>[] = [];
  disabled$: Observable<boolean>;

  constructor(public cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.disabled$ = this.config.disabledCallback
    ? this.config.disabledCallback(this.group, this.config)
    : of(false);
  }

  filesChanged(files: FileList): void {
    if (files && files.length > 0 ) {
      this.selectedFiles = files
      this.control.patchValue(files);
    }
  }

  uploadFiles() {
    if(this.selectedFiles && this.config.uploadFiles) {
      this.isUploaded = true;
      this.config.uploadFiles(this.group, this.selectedFiles, this);
    }
  }

  resetFileInput(): void {
    this.fileInputRef.nativeElement.value = ''
    this.control.patchValue(null);
  }
}
