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
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import imageCompression from 'browser-image-compression';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { convertBytesToMb } from './image-compression.helpers';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';

import { FileDropzoneDirective } from '@tft/crispr-forms/ui/file-dropzone';
import { SelectedFileComponent } from '@tft/crispr-forms/ui/selected-file';
import { FieldContainerComponent } from '@tft/crispr-forms/ui/field-container';
import { crisprControlMixin, CrisprFieldComponent, ImageUploadFieldConfig } from '@tft/crispr-forms/utils';

const ImageUploadFieldMixin = crisprControlMixin<ImageUploadFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-image-upload-field',
  templateUrl: './image-upload-field.component.html',
  styleUrls: ['./image-upload-field.component.scss'],
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
    FileDropzoneDirective,
    FormValidationHandlerModule
  ],
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

  private inputImageFileSubject = new Subject<File | null>();
  inputImageFile$ = this.inputImageFileSubject.asObservable().pipe(
    shareReplay(1),
  );
  /**
   * the compression progress
   */
  progress: number | undefined;

  compressedFile$: Observable<File> = this.inputImageFile$.pipe(
    switchMap(async (file) => {
      if (!file || !(file instanceof File)) return null;
      const { compressImage, targetCompressedImageFileSizeMb, minCompressionThresholdMb, maxWidthOrHeight, useWebWorker } = this.config;
      const fileSizeMb = convertBytesToMb(file.size);
      const shouldCompress = compressImage
        && targetCompressedImageFileSizeMb < fileSizeMb
        && minCompressionThresholdMb < fileSizeMb
      if (shouldCompress) {
        const options = {
          // Use maxWidthOrHeight if it was provided, else use target compressed size
          ...(maxWidthOrHeight ? {maxWidthOrHeight} : { maxSizeMB: targetCompressedImageFileSizeMb}),
          useWebWorker,
          maxIterations: 30,
          onProgress: (progress: number) => {
            this.progress = progress;
            this.cdr.detectChanges();
          }
        }
        return await imageCompression(file, options);
      } else return  file;
    }),
    map((compressedFile: File) => {
      if(!compressedFile) return compressedFile;
      const { type, name, lastModified } = compressedFile
      return new File([compressedFile], this.config.fileName || name, {
        type,
        lastModified
      });
    }),
    tap(file => {
      // only set the value if there is a file because resetToInitialValue sets the control value
      // to initial value and clears the compressed image, so setting it to null here would undo that
      if (file) {
        this.control.setValue(file);
      }
      if (file || this.value) {
        this.control.markAsTouched();
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100)
      }
    }),
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
      this.control.valueChanges.pipe(
        startWith(this.value),
        map((controlValue): string => {
          if(!controlValue) return null;
          if(controlValue instanceof File) return null;
          return this.config.mapInputValueToUrl?.(controlValue) || controlValue as string
        })
      )
    ]).pipe(
      map(([compressedImageUrlString, controlUrl]) => {
        return compressedImageUrlString || controlUrl || null;
      })
    )
    this.disabled$ = this.config.disabledCallback
    ? this.config.disabledCallback(this.group)
    : of(false);
  }

  filesChanged(files: FileList): void {
    if (files && files.length > 0 ) {
      const imageFile = files[0];
      // We clear the control here so that it is invalid while compressing
      // the input pipeline will take care of resetting it
      this.control.patchValue(null);
      // this.control.setErrors({compressing: {loadingMessage: 'Please wait while file compresses'}});
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
    this.inputImageFileSubject.next(null);
    this.control.patchValue(initialValue)
    this.isUploaded = false;
  }

  writeValue( value: null ) { }

  registerOnChange( fn: () => void ) {
    this.onChange = fn;
  }

  registerOnTouched( fn: () => void ) { }
}


