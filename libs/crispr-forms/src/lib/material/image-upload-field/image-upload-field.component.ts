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
import {
  DOC_ORIENTATION,
  NgxImageCompressService,
} from 'ngx-image-compress';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { FileUploadFieldModule } from '..';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { FieldContainerModule } from '../../field-container/field-container.component';
import { ImageUploadFieldConfig } from '../../models/image-upload-field.config';
import { convertBytesToMb, fileToDataURL, dataUrlToFile } from './image-compression.helpers';

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
    uploadButtonText: 'UPLOAD',
    uploadButtonType: 'button',
    imageHeight: '250px',
    showUploadProgress: true,
    compressImage: false,
    targetImageFileSizeMb: .3,
    orientation: DOC_ORIENTATION.Default,
    ratio: 50,
    quality: 50
  }

  private inputImageFileSubject = new BehaviorSubject<File | null>(null);

  inputImageFile$ = this.inputImageFileSubject.asObservable();

  imageUrlString$: Observable<string | null> = this.inputImageFile$.pipe(
    switchMap(async (file) => {
      if(!file) return null;
      console.log(file);
      const { compressImage, targetImageFileSizeMb, maxFileSizeMb, orientation, quality, ratio, maxHeight, maxWidth} = this.config;
      const fileSizeMb = convertBytesToMb(file.size);
      if(maxFileSizeMb && fileSizeMb > maxFileSizeMb) throw `file size too large`
      const stringImage: string = await fileToDataURL(file);
      console.log(fileSizeMb);
      let compressedStringImage: string;
      if (compressImage && (targetImageFileSizeMb < fileSizeMb)) {
        console.log('compressing')
        compressedStringImage = await this.compressImage(stringImage, targetImageFileSizeMb, fileSizeMb, orientation, maxWidth, maxHeight );

      } else {
        console.log('not compressing')

        compressedStringImage = stringImage;
      }
      return file.type.includes('svg')
        ? this.domSanitizer.bypassSecurityTrustResourceUrl(compressedStringImage) as string
        : compressedStringImage;
    }),
    shareReplay(1),


  )

  compressedFile$: Observable<File> = combineLatest([
    this.inputImageFile$,
    this.imageUrlString$
  ]).pipe(
    filter(([inputImageFile, imageUrlString]) => (!!inputImageFile && !!imageUrlString) ),
    switchMap(async ([inputImageFile, imageUrlString]) => {
      const compressedFile = await dataUrlToFile(imageUrlString, inputImageFile.name);
      const initialSize = inputImageFile.size;
      const compressedFileSize = compressedFile.size;

      console.log({initialSize, compressedFileSize, ratio: compressedFileSize/initialSize});
      return compressedFile;
    })
  )

  @ViewChild('fileInput') fileInputRef: ElementRef

  selectedFiles: FileList;

  isUploaded = false;

  fileProgress: Observable<number>[] = [];
  disabled$: Observable<boolean>;

  // ngControl: NgControl = null;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private domSanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
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
    this.disabled$ = this.config.disabledCallback
    ? this.config.disabledCallback(this.group, this.config)
    : of(false);
    console.log(this.value)
  }

  filesChanged(files: FileList): void {
    if (files && files.length > 0 ) {
      const imageFile = files[0];
      this.selectedFiles = files;
      this.inputImageFileSubject.next(imageFile);
    }
  }

  uploadFiles() {
    if(this.selectedFiles && this.config.uploadFiles) {
      this.isUploaded = true;
      this.config.uploadFiles(this.group, this.selectedFiles, this);
    }
  }

  clearFileInput(): void {
    this.inputImageFileSubject.next(null);
    this.fileInputRef.nativeElement.value = ''
    this.selectedFiles = null;
    this.control.patchValue(null);
    this.isUploaded = false;
  }

  resetToInitialValue(initialValue: string): void {
    this.inputImageFileSubject.next(null);
    // this.fileInputRef.nativeElement.value = initialValue
    this.control.patchValue(initialValue);
    this.isUploaded = false;
  }

  async compressImage(stringImage: string, targetImageFileSizeMb: number, initialFileSizeMb: number, orientation: DOC_ORIENTATION, maxWidth: number, maxHeight) {
    const compressionRatio = targetImageFileSizeMb / initialFileSizeMb;
    console.log({compressionRatio})
    const ratio = 99;
    const quality = 99;
    return await this.imageCompress.compressFile(stringImage, orientation, ratio, quality, maxWidth, maxHeight)
  }

  writeValue( value: null ) {
    console.log('writingValue', value)
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
export class ImageUploadFieldModule { }
