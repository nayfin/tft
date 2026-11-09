/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, untracked, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import imageCompression from 'browser-image-compression';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FileDropzoneDirective } from '../file-dropzone';
import { SelectedFileComponent } from '../selected-file';
import { FieldContainerComponent } from '../field-container';
import {
  convertBytesToMb,
  ImageProcessingState,
  ImageUploadFieldConfig,
} from '../../utils';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

@Component({
    selector: 'crispr-image-upload-field',
    templateUrl: './image-upload-field.component.html',
    styleUrls: ['./image-upload-field.component.scss'],
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
        FileDropzoneDirective,
        FormValidationHandlerModule,
    ],
    standalone: true
})
export class ImageUploadFieldComponent
  extends CrisprControlComponent<ImageUploadFieldConfig>
  implements OnInit, ControlValueAccessor
{
  ngControl = inject(NgControl, { optional: true, self: true });
  private domSanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

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
    targetCompressedImageFileSizeMb: 0.4,
    minCompressionThresholdMb: 0.6,
    useWebWorker: true,
  };

  private inputImageFileSubject = new Subject<File | null>();
  inputImageFile$ = this.inputImageFileSubject
    .asObservable()
    .pipe(shareReplay(1));

  /**
   * The compression progress (0-100), undefined when nothing is compressing
   */
  progress = signal<number | undefined>(undefined);

  /**
   * Whether the field is idle, processing (compressing) a selected image, or failed to process it.
   * While `processing` or `failed` the control is invalid.
   */
  processingState = signal<ImageProcessingState>('idle');

  /** The message describing why processing failed, null unless `processingState` is `failed` */
  failureMessage = signal<string | null>(null);

  /** The name of the file currently being processed */
  processingFileName = signal<string>('');

  /**
   * The most recently selected file (null once cleared/reset). Used to ignore progress
   * reports from compressions that were superseded by a newer selection.
   */
  private latestFile: File | null = null;

  /**
   * Makes the control invalid while an image is processing or after processing failed.
   * Implemented as a validator because Angular clears manually set errors whenever
   * the control's validity is recalculated.
   */
  private imageProcessingValidator: ValidatorFn = (): ValidationErrors | null =>
    // untracked: this runs inside effects (e.g. setControlValue) which must not depend on the state
    untracked(() => {
      switch (this.processingState()) {
        case 'processing':
          return { imageProcessing: true };
        case 'failed':
          return {
            imageProcessingFailed: {
              message:
                this.failureMessage() ||
                'The image could not be processed. Please try a different image.',
            },
          };
        default:
          return null;
      }
    });

  /**
   * Compresses (when configured) and wraps each selected file. Failures are caught inside the
   * switchMap so that one bad file never errors out, and so kills, the stream.
   */
  compressedFile$: Observable<File | null> = this.inputImageFile$.pipe(
    switchMap(async (file): Promise<{ file: File | null; failed?: File }> => {
      if (!file || !(file instanceof File)) return { file: null };
      try {
        const {
          compressImage,
          targetCompressedImageFileSizeMb,
          minCompressionThresholdMb,
          maxWidthOrHeight,
          useWebWorker,
        } = this.config();
        const fileSizeMb = convertBytesToMb(file.size);
        const shouldCompress =
          compressImage &&
          targetCompressedImageFileSizeMb < fileSizeMb &&
          minCompressionThresholdMb < fileSizeMb;
        let processed: File = file;
        if (shouldCompress) {
          const options = {
            // Use maxWidthOrHeight if it was provided, else use target compressed size
            ...(maxWidthOrHeight
              ? { maxWidthOrHeight }
              : { maxSizeMB: targetCompressedImageFileSizeMb }),
            useWebWorker,
            maxIterations: 30,
            onProgress: (progress: number) => {
              // ignore progress from a compression that a newer selection has superseded
              if (this.latestFile !== file) return;
              this.progress.set(progress);
            },
          };
          processed = await imageCompression(file, options);
        }
        const { type, name, lastModified } = processed;
        return {
          file: new File([processed], this.config().fileName || name, {
            type,
            lastModified,
          }),
        };
      } catch {
        return { file: null, failed: file };
      }
    }),
    // switchMap has already discarded results of superseded selections, so state
    // transitions made here always belong to the latest selection
    tap(({ file, failed }) => {
      const control = this.control();
      if (failed) {
        this.progress.set(undefined);
        this.setProcessingState(
          'failed',
          `Unable to process "${failed.name}". Please try a different image.`,
          () => control.updateValueAndValidity()
        );
      } else if (file) {
        this.progress.set(undefined);
        // only set the value if there is a file because resetToInitialValue sets the control value
        // to initial value and clears the compressed image, so setting it to null here would undo that
        this.setProcessingState('idle', null, () => control.setValue(file));
        this.config().filesChanged?.(this.group(), file);
      }
      if (file || this.value()) {
        control.markAsTouched();
        this.cdr.markForCheck();
      }
    }),
    map(({ file }) => file),
    shareReplay(1)
  );

  compressedImageUrlString$: Observable<string | null> =
    this.compressedFile$.pipe(
      switchMap(async (file) => {
        if (!file) return null;
        try {
          const compressedStringImage = await imageCompression.getDataUrlFromFile(
            file
          );
          return this.domSanitizer.bypassSecurityTrustResourceUrl(
            compressedStringImage
          ) as string;
        } catch {
          return null;
        }
      }),
      shareReplay(1)
    );

  // This is what is displayed by the image preview
  imageSrcUrl$: Observable<string | null>;

  @ViewChild('fileInput') fileInputRef: ElementRef;

  selectedFiles: FileList;

  isUploaded = false;

  disabled$: Observable<boolean>;

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
    const control = this.control();
    control.addValidators(this.imageProcessingValidator);
    this.destroyRef.onDestroy(() =>
      control.removeValidators(this.imageProcessingValidator)
    );
    this.imageSrcUrl$ = combineLatest([
      this.compressedImageUrlString$.pipe(startWith(null)),
      this.control().valueChanges.pipe(
        startWith(this.value()),
        map((controlValue): string => {
          if (!controlValue) return null;
          if (controlValue instanceof File) return null;
          return (
            this.config().mapInputValueToUrl?.(controlValue) ||
            (controlValue as string)
          );
        })
      ),
    ]).pipe(
      map(([compressedImageUrlString, controlUrl]) => {
        return compressedImageUrlString || controlUrl || null;
      })
    );
    this.disabled$ = this.config().disabledCallback
      ? this.config().disabledCallback(this.group())
      : of(false);
  }

  filesChanged(files: FileList): void {
    if (files && files.length > 0) {
      const imageFile = files[0];
      this.latestFile = imageFile;
      this.progress.set(undefined);
      this.processingFileName.set(imageFile.name);
      // We clear the control here and flag the field as processing so that the control is invalid
      // while compressing, the input pipeline will take care of setting the processed value
      this.setProcessingState('processing', null, () => {
        this.control().patchValue(null);
        this.control().markAsTouched();
      });
      this.inputImageFileSubject.next(imageFile);
    }
  }

  clearFileInput(): void {
    this.latestFile = null;
    this.inputImageFileSubject.next(null);
    this.fileInputRef.nativeElement.value = '';
    this.progress.set(undefined);
    this.setProcessingState('idle', null, () => {
      this.control().patchValue(null);
      this.control().markAsTouched();
    });
    this.isUploaded = false;
  }

  resetToInitialValue(initialValue: string): void {
    this.latestFile = null;
    this.inputImageFileSubject.next(null);
    this.progress.set(undefined);
    this.setProcessingState('idle', null, () =>
      this.control().patchValue(initialValue)
    );
    this.isUploaded = false;
  }

  /**
   * Transitions the processing state. `applyValue` updates the control (which revalidates it),
   * so validity is current before `processingStateChange` is called. The callback only fires
   * when the state actually changes.
   */
  private setProcessingState(
    state: ImageProcessingState,
    message: string | null,
    applyValue: () => void
  ): void {
    const changed =
      this.processingState() !== state || this.failureMessage() !== message;
    this.processingState.set(state);
    this.failureMessage.set(message);
    applyValue();
    if (changed) {
      this.config().processingStateChange?.(state, this.group());
    }
  }

  writeValue(value: null) {}

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {}
}
