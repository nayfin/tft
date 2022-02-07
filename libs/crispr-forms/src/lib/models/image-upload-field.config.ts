import { FormGroup } from '@angular/forms';
import { CrisprControlConfig, ControlType, ButtonType, MatFieldProperties, EnabledUploadButtonConfig } from '../models';

export type ImageUploadFieldConfig = CrisprControlConfig & MatFieldProperties & {
  controlType: ControlType.IMAGE_UPLOAD;
  label?: string;
  filesChanged?: (parentGroup: FormGroup, files: FileList) => void;
  acceptedTypes?: `image/${string}`;
  /**
   * The maximum allowed size in bytes of image
   */
  maximumFileSizeBytes?: number;
  /**
   * The minimum size in bytes of a file to trigger image compression
   */
  minimumCompressionSizeBytes?: number;
  showClearFilesButton?: boolean;
  selectFilesButtonType?: ButtonType;
  selectButtonText?: string;
  clearFilesButtonText?: string;
  dropZoneText?: string;
  // isolate possible configurations regarding upload to for user to properly type configuration
} & (EnabledUploadButtonConfig | DisabledUploadButtonConfig);

// The properties that are only available if we are using the uploadFiles callback
// export interface EnabledUploadButtonConfig {
//   uploadFiles: (parentGroup: FormGroup, files:FileList, uploadComponent: ImageUploadFieldComponent) => Promise<unknown> | unknown;
//   showUploadProgress?: boolean;
//   disableOnUpload?: boolean;
//   uploadButtonType?: ButtonType;
//   uploadButtonText?: string;
// }

type DisabledUploadButtonConfig = NeverProps<EnabledUploadButtonConfig>;

type NeverProps<T> = { [P in keyof T]?: never; };
