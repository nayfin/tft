/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ChangeDetectionStrategy, signal, computed, inject, viewChild } from '@angular/core';
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
import { ControlErrorContainerDirective, ControlErrorsDirective } from '@tft/form-validation-handler';

import { FileUploadFieldConfig } from '../../utils';
import { FieldContainerComponent } from '../field-container';
import { SelectedFileComponent } from '../selected-file';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

@Component({
    selector: 'crispr-file-upload-field',
    templateUrl: './file-upload-field.component.html',
    styleUrls: ['./file-upload-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FieldContainerComponent,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        SelectedFileComponent,
        ControlErrorContainerDirective,
        ControlErrorsDirective,
        FileDropzoneDirective
    ],
    standalone: true
})
export class FileUploadFieldComponent
  extends CrisprControlComponent<FileUploadFieldConfig>
  implements OnInit, ControlValueAccessor
{
  ngControl = inject(NgControl, { optional: true, self: true });

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

  readonly fileInputRef = viewChild<ElementRef>('fileInput');

  selectedFiles = signal<FileList | null>(null);
  selectedFilesArray = computed(() => this.selectedFiles() ? Array.from(this.selectedFiles()) : []);

  /**
   * Whether the files have been uploaded. A signal so that changes made asynchronously (e.g. from the
   * `uploadFiles` callback once an upload finishes) re-render the OnPush/zoneless component.
   */
  readonly uploaded = signal(false);

  /**
   * Plain boolean view of `uploaded`, kept only for the public `AbstractUploadComponent` contract so
   * consumers of the `uploadFiles` callback can still read and assign `isUploaded`.
   * Internal code and the template use the `uploaded` signal directly.
   */
  get isUploaded(): boolean {
    return this.uploaded();
  }
  set isUploaded(value: boolean) {
    this.uploaded.set(value);
  }

  fileProgress: Observable<number>[] = [];
  disabled$: Observable<boolean>;

  // ngControl: NgControl = null;
  constructor() {
    super();
    const ngControl = this.ngControl;

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.disabled$ = this.config().disabledCallback
      ? this.config().disabledCallback(this.group())
      : of(false);
  }

  filesChanged(files: FileList): void {
    if (files && files.length > 0) {
      this.selectedFiles.set(files);
      this.control().patchValue(files);
      this.config().filesChanged?.(this.group(), files);
    }
  }

  uploadFiles() {
    if (this.selectedFiles() && this.config().uploadFiles) {
      this.uploaded.set(true);
      this.config().uploadFiles(this.group(), this.selectedFiles(), this);
    }
  }

  resetFileInput(): void {
    this.fileInputRef().nativeElement.value = '';
    this.control().patchValue(null);
    this.uploaded.set(false);
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
