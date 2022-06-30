import { FormGroup } from '@angular/forms';
import { CrisprControlConfig, ControlType, ButtonType, MatFieldProperties, EnabledUploadButtonConfig } from '../models';

export type ImageUploadFieldConfig = CrisprControlConfig & MatFieldProperties & {
  controlType: ControlType.IMAGE_UPLOAD;
  label: string;
  filesChanged?: (parentGroup: FormGroup, file: File) => void;
  /**
   * The file types to accept. The onus is on the consuming developer to limit these to file types compatible with usage.
   * See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
   */
  acceptedTypes: string;
  fileName?: string;

  showClearFilesButton?: boolean;
  selectFilesButtonType?: ButtonType;
  selectButtonText?: string;
  clearFilesButtonText?: string;
  resetFilesButtonText?: string;
  dropZoneText?: string;
  /**
   * If the input value of the control is not a string of the src
   * url to the image, this function allows consumers to map their
   * input value into one
   */
  mapInputValueToUrl?: (inputValue: unknown) => string;
  /**
   * Should the field compress the image after loading it
   * @default false
   */
  compressImage?: boolean;
  /**
   * The target size of the compressed image
   */
  targetCompressedImageFileSizeMb?: number;
  /**
   * The minimum file size in MB required to trigger compression. Useful for preventing compression on files near the target compression size.
   * @default .7
   */
  minCompressionThresholdMb?: number;
  /**
   * The maximum height or width of the compressed image
   * @default undefined
   */
  maxWidthOrHeight?: number;
  /**
   * When true runs compression using a web worker, otherwise compression happens on the main thread.
   * @default true
   */
  useWebWorker?: boolean;

  /**
   * The height of the image preview container
   */
   imagePreviewHeight?: string;
}
