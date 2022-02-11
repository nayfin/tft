import { FormGroup } from '@angular/forms';
import { DOC_ORIENTATION } from 'ngx-image-compress';
import { CrisprControlConfig, ControlType, ButtonType, MatFieldProperties, EnabledUploadButtonConfig } from '../models';

export type ImageUploadFieldConfig = CrisprControlConfig & MatFieldProperties & {
  controlType: ControlType.IMAGE_UPLOAD;
  label?: string;
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
   * The maximum allowed size in bytes of image
   */
  maxFileSizeMb?: number;
  /**
   * The targe size of the compressed image
   */
  targetImageFileSizeMb?: number;
  // isolate possible configurations regarding upload to for user to properly type configuration
  compressImage?: boolean;
  /**
   * The hight of the image display container
   */
  imageHeight?: string;
  orientation?: DOC_ORIENTATION;
  ratio?: number;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number
} & (EnabledUploadButtonConfig | DisabledUploadButtonConfig);


type DisabledUploadButtonConfig = NeverProps<EnabledUploadButtonConfig>;

type NeverProps<T> = { [P in keyof T]?: never; };
