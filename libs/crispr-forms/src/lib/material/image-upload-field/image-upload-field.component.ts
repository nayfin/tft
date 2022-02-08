import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  Optional,
  Self,
  ChangeDetectorRef,
  NgModule
} from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { FileUploadFieldModule } from '..';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { FieldContainerModule } from '../../field-container/field-container.component';
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
    // allowMultipleFiles: false,
    acceptedTypes: 'image/*',
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

  _imageSource: string;
  set imageSource(imageSource: ArrayBuffer | string) {
    // this.imageIsSvg = imageSource;
    console.log(typeof imageSource);
    this._imageSource = this.domSanitizer.bypassSecurityTrustUrl(imageSource as unknown as string) as string;
  }

  @ViewChild('fileInput') fileInputRef: ElementRef

  selectedFiles: FileList;

  isUploaded = false;

  fileProgress: Observable<number>[] = [];
  disabled$: Observable<boolean>;

  // ngControl: NgControl = null;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
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
      const imageFile = files[0];

      console.log({imageFile})
      const fileReader = new FileReader();
      fileReader.onload = () => {
        console.log({result: fileReader.result})
        this.imageSource = fileReader.result;
        this.cdr.detectChanges();
        return this.imageSource;

      }
      this.selectedFiles = files;
      fileReader.readAsDataURL(imageFile)
      this.control.patchValue(imageFile);
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
    this.selectedFiles = null;
    this.control.patchValue(null);
    this.imageSource = null;
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

  registerOnTouched( fn: () => void ) { }
}
@NgModule({
    imports: [
        CommonModule,
        FieldContainerModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FileUploadFieldModule
    ],
    exports: [
        ImageUploadFieldComponent
    ],
    declarations: [
        ImageUploadFieldComponent
    ]
})
export class ImageUploadFieldModule {
}

