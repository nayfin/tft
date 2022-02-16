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
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import imageCompression from 'browser-image-compression';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { FileUploadFieldModule } from '../file-upload';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { FieldContainerModule } from '../../field-container/field-container.component';
import type { ImageUploadFieldConfig } from '../../models/image-upload-field.config';
import { convertBytesToMb } from './image-compression.helpers';
import { SelectedFileModule } from '../selected-file/selected-file.component';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';

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
    resetFilesButtonText: 'RESET',
    imagePreviewHeight: '250px',
    compressImage: false,
    targetCompressedImageFileSizeMb: .4,
    minCompressionThresholdMb: .6,
    useWebWorker: true,
  }

  progress: number | undefined;
  private inputImageFileSubject = new Subject<File | string | null>();

  inputImageFile$ = this.inputImageFileSubject.asObservable().pipe(
    shareReplay(1),
  );

  compressedFile$: Observable<File> = this.inputImageFile$.pipe(
    switchMap(async (file) => {
      if (!file) return null;
      if (typeof file === 'string') return file
      const { compressImage, targetCompressedImageFileSizeMb, minCompressionThresholdMb, maxWidthOrHeight, useWebWorker } = this.config;
      const fileSizeMb = convertBytesToMb(file.size);
      const shouldCompress = compressImage && targetCompressedImageFileSizeMb < fileSizeMb && minCompressionThresholdMb < fileSizeMb
      if (shouldCompress) {
        const options = {
          // Use maxWidthOrHeight if it was provided, else use target compressed size
          ...(maxWidthOrHeight ? {maxWidthOrHeight} : { maxSizeMB: targetCompressedImageFileSizeMb}),
          useWebWorker,
          maxIterations: 30,
          onProgress: (p: number) => {
            this.progress = p;
            this.cdr.detectChanges();
          }
        }
        return await imageCompression(file, options);
      } else return  file;
    }),
    map((compressedFileOrString: File | string) => {
      if(!compressedFileOrString || typeof compressedFileOrString === 'string') return compressedFileOrString;
      const { type, name, lastModified } = compressedFileOrString
      return new File([compressedFileOrString], this.config.fileName || name, {
        type,
        lastModified
      });
    }),
    tap(file => {
      this.control.setValue(file);
      if (file || this.value) {
        this.control.markAsTouched();
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100)
      }
    }),
    map(file => typeof file === 'string' ? null : file),
    shareReplay(1)
  )

  compressedImageUrlString$: Observable<string | null> = this.compressedFile$.pipe(
    switchMap(async (file) => {
      if(!file) return null;
      const compressedStringImage = await imageCompression.getDataUrlFromFile(file);
      return this.domSanitizer.bypassSecurityTrustResourceUrl(compressedStringImage) as string
    }),
    shareReplay(1),
  )

  // This is what is displayed by the image preview
  imageSrcUrl$: Observable<string | null>;

  @ViewChild('fileInput') fileInputRef: ElementRef

  selectedFiles: FileList;

  isUploaded = false;

  disabled$: Observable<boolean>;

  // ngControl: NgControl = null;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
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
    this.imageSrcUrl$ = combineLatest([
      this.compressedImageUrlString$.pipe(startWith(null)),
      this.control.valueChanges.pipe(startWith(this.value))
    ]).pipe(
      map(([compressedImageUrlString, controlUrl]) => {
        return compressedImageUrlString || typeof controlUrl === 'string' && controlUrl || null;
      })
    )
    this.disabled$ = this.config.disabledCallback
    ? this.config.disabledCallback(this.group, this.config)
    : of(false);
  }

  filesChanged(files: FileList): void {
    if (files && files.length > 0 ) {
      const imageFile = files[0];
      this.control.markAsTouched();
      this.inputImageFileSubject.next(imageFile);
    }
  }

  clearFileInput(): void {
    this.inputImageFileSubject.next(null);
    this.fileInputRef.nativeElement.value = ''
    this.control.patchValue(null);
    this.control.markAsTouched();
    this.isUploaded = false;
  }

  resetToInitialValue(initialValue: string): void {
    this.inputImageFileSubject.next(initialValue);
    // this.fileInputRef.nativeElement.value = initialValue
    this.isUploaded = false;
  }

  writeValue( value: null ) { }

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
    SelectedFileModule,
    FileUploadFieldModule,
    FormValidationHandlerModule
  ],
  exports: [
      ImageUploadFieldComponent
  ],
  declarations: [
      ImageUploadFieldComponent
  ]
})
export class ImageUploadFieldModule { }

export function maxFileSizeValidator(maxFileSize: number): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    const controlValue = control.value;
    if (!(controlValue instanceof File)) {
      return null;
    }
    const actualFileSize = +convertBytesToMb(controlValue.size).toPrecision(3);
    if (maxFileSize > actualFileSize) return null;
    // control.setErrors({maxFileSize: { maxFileSize, actualFileSize }} )
    return {maxFileSize: { maxFileSize, actualFileSize }};
  }
}

export function allowedFileExtValidator(allowedFileExtensions: string[], onlyAllowFiles = true): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    const controlValue = control.value;
    const isFile = controlValue instanceof File;
    if (!onlyAllowFiles && !isFile) return null;
    const actualExtension = isFile ? controlValue.name.split('.').pop().toLocaleLowerCase() : 'Not a file';
    const isAllowedExtension = allowedFileExtensions.includes(actualExtension);
    if(isAllowedExtension) {
      return null;
    }
    return {allowedExtension: { allowedFileExtensions, actualExtension }};
  }
}
