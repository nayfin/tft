import { FormGroup } from '@angular/forms';
// TODO: use below imports after creating entry points for fields
// import type { FileUploadFieldComponent } from '../material/file-upload/file-upload.component';
// import type { ImageUploadFieldComponent } from '../material/image-upload-field';
import { CrisprControlConfig, ControlType, MatFieldProperties } from './crispr-field.config';
import { ButtonType } from './button.config';

export type FileUploadFieldConfig = CrisprControlConfig & MatFieldProperties & {
  controlType: ControlType.FILE_UPLOAD;
  label: string;
  filesChanged?: (parentGroup: FormGroup, files: FileList) => void;
  allowMultipleFiles?: boolean;
  showClearFilesButton?: boolean;
  acceptedTypes?: string;
  selectFilesButtonType?: ButtonType;
  selectButtonText?: string;
  clearFilesButtonText?: string;
  dropZoneText?: string;
  // isolate possible configurations regarding upload to for user to properly type configuration
} & (EnabledUploadButtonConfig | DisabledUploadButtonConfig);

// The properties that are only available if we are using the uploadFiles callback
export interface EnabledUploadButtonConfig {
  uploadFiles: (parentGroup: FormGroup, files:FileList, uploadComponent: any /** FileUploadFieldComponent | ImageUploadFieldComponent */) => Promise<unknown> | unknown;
  showUploadProgress?: boolean;
  disableOnUpload?: boolean;
  uploadButtonType?: ButtonType;
  uploadButtonText?: string;
}

type DisabledUploadButtonConfig = NeverProps<EnabledUploadButtonConfig>;

type NeverProps<T> = { [P in keyof T]?: never; };