/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { Observable, of } from 'rxjs';
import { FileDropzoneDirective } from '@tft/crispr-forms/ui/file-dropzone';

import { crisprControlMixin, CrisprFieldComponent, FileUploadFieldConfig } from '@tft/crispr-forms/utils';
import { FieldContainerComponent } from '@tft/crispr-forms/ui/field-container';
import { SelectedFileComponent } from '@tft/crispr-forms/ui/selected-file';

const FileUploadFieldMixin = crisprControlMixin<FileUploadFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-file-upload-field',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FieldContainerComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SelectedFileComponent,
    FormValidationHandlerModule,
    FileDropzoneDirective
  ],
})
export class FileUploadFieldComponent extends FileUploadFieldMixin implements OnInit, ControlValueAccessor {

  onChange: () => void;

  defaultConfig: Partial<FileUploadFieldConfig> = {
    allowMultipleFiles: false,
    acceptedTypes: '*.*',
    dropZoneText: 'DROP FILE HERE',
    selectFilesButtonType: 'button',
    selectButtonText: 'SELECT',
    showClearFilesButton: true,
    clearFilesButtonText: 'CLEAR',
    uploadButtonText: 'UPLOAD',
    uploadButtonType: 'button',
    showUploadProgress: false,
    disableOnUpload: true
  }

  @ViewChild('fileInput') fileInputRef: ElementRef

  selectedFiles: FileList;

  isUploaded = false;

  fileProgress: Observable<number>[] = [];
  disabled$: Observable<boolean>;

  // ngControl: NgControl = null;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
  ) {
    super();
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.disabled$ = this.config.disabledCallback
    ? this.config.disabledCallback(this.group)
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
    this.isUploaded = false;
  }

  writeValue( value: null ) {
    // clear file input
    // this.host.nativeElement.value = '';
    // this.file = null;
  }

  registerOnChange( fn: () => void ) {
    this.onChange = fn;
  }

  registerOnTouched( fn: () => void ) {
  }
}
