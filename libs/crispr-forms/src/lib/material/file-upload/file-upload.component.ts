import {
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { FileUploadFieldConfig } from '../../models/file-upload-field.config';

const FileUploadFieldMixin = crisprControlMixin<FileUploadFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends FileUploadFieldMixin {

  defaultConfig: Partial<FileUploadFieldConfig> = {
    allowMultipleFiles: false,
    showDeleteButton: true,
    showUploadButton: true,
    acceptedTypes: '*.*',
    selectButtonText: 'SELECT FILE',
    uploadButtonText: 'UPLOAD FILE',
    selectFilesButtonType: 'button',
    uploadButtonType: 'button'
  }

  @ViewChild('fileInput') fileInputRef: ElementRef
  selectedFiles: FileList;
  selectedFileText = '';

  constructor() {
    super();
  }

  filesChanged(event: InputEvent & {target: {files: FileList}}): void {
    const files: FileList = event.target.files

    if (files && files.length > 0 ) {

      this.selectedFiles = files
      this.control.patchValue(files);
      const numSelectedFiles = files.length;
      this.selectedFileText = numSelectedFiles === 1
        ? files[0].name
        : `${numSelectedFiles} files selected`;
    }
  }

  uploadFiles() {
    if(this.selectedFiles) {
      this.config.uploadFile(this.group, this.selectedFiles);
    }
  }

  resetFileInput(): void {
    this.fileInputRef.nativeElement.value = ''
    this.control.patchValue(null);
    this.selectedFileText = '';
  }
}
