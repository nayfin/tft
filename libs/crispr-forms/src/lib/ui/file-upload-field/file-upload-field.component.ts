/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  Optional,
  Self,
  signal,
  computed,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import { FileDropzoneDirective } from '../file-dropzone';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';

import {
  CrisprFieldComponent,
  FileUploadFieldConfig,
} from '../../utils';
import { FieldContainerComponent } from '../field-container';
import { SelectedFileComponent } from '../selected-file';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

@Component({
  selector: 'crispr-file-upload-field',
  templateUrl: './file-upload-field.component.html',
  styleUrls: ['./file-upload-field.component.scss'],
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
    FileDropzoneDirective,
  ],
})
export class FileUploadFieldComponent
  extends CrisprControlComponent<FileUploadFieldConfig>
  implements OnInit, ControlValueAccessor
{
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
    disableOnUpload: true,
  };

  @ViewChild('fileInput') fileInputRef: ElementRef;

  selectedFiles = signal<FileList | null>(null);
  selectedFilesArray = computed(() => Array.from(this.selectedFiles()));

  isUploaded = false;

  fileProgress: Observable<number>[] = [];
  disabled$: Observable<boolean>;

  // ngControl: NgControl = null;
  constructor(@Optional() @Self() public ngControl: NgControl) {
    super();
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.disabled$ = this.config().disabledCallback
      ? this.config().disabledCallback(this.group)
      : of(false);
  }

  filesChanged(files: FileList): void {
    if (files && files.length > 0) {
      this.selectedFiles.set(files);
      this.control.patchValue(files);
    }
  }

  uploadFiles() {
    if (this.selectedFiles() && this.config().uploadFiles) {
      this.isUploaded = true;
      this.config().uploadFiles(this.group, this.selectedFiles(), this);
    }
  }

  resetFileInput(): void {
    this.fileInputRef.nativeElement.value = '';
    this.control.patchValue(null);
    this.isUploaded = false;
  }

  writeValue(value: null) {
    // clear file input
    // this.host.nativeElement.value = '';
    // this.file = null;
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {}
}
