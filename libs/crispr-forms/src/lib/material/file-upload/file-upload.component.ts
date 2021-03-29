import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  Optional,
  Self
} from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { FileUploadFieldConfig } from '../../models/file-upload-field.config';

const FileUploadFieldMixin = crisprControlMixin<FileUploadFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent extends FileUploadFieldMixin implements OnInit, ControlValueAccessor {

  onChange: () => void;

  defaultConfig: Partial<FileUploadFieldConfig> = {
    allowMultipleFiles: false,
    acceptedTypes: '*.*',
    dropZoneText: 'DROP FILE HERE',
    selectFilesButtonType: 'button',
    selectButtonText: 'SELECT FILES',
    showClearFilesButton: true,
    clearFilesButtonText: 'CLEAR FILES',
    uploadButtonText: 'UPLOAD FILES',
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
      ngControl.control.valueChanges.subscribe(valueChanges => console.log({valueChanges}))
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
  }

  writeValue( value: null ) {
    // clear file input
    console.log('writing value', value)
    // this.host.nativeElement.value = '';
    // this.file = null;
  }

  registerOnChange( fn: () => void ) {
    console.log({fn})
    this.onChange = fn;
  }

  registerOnTouched( fn: () => void ) {
  }
}
