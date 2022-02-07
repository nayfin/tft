import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  Optional,
  Self
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { ImageUploadFieldConfig } from '../../models/image-upload-field.config';

const ImageUploadFieldMixin = crisprControlMixin<ImageUploadFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-image-upload-field',
  templateUrl: './image-upload-field.component.html',
  styleUrls: ['./image-upload-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadFieldComponent extends ImageUploadFieldMixin implements OnInit, ControlValueAccessor {

  onChange: () => void;

  defaultConfig: Partial<ImageUploadFieldConfig> = {
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
