import { FormGroup } from '@angular/forms';
import { FileUploadComponent } from '../material';
import { CrisprControlConfig, ControlType, ButtonType, MatFieldProperties } from '../models';

export type FileUploadFieldConfig = CrisprControlConfig & MatFieldProperties & {
  controlType: ControlType.FILE_UPLOAD;
  label?: string;
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
  uploadFiles: (parentGroup: FormGroup, files:FileList, uploadComponent: FileUploadComponent) => Promise<unknown> | unknown;
  showUploadProgress?: boolean;
  disableOnUpload?: boolean;
  uploadButtonType?: ButtonType;
  uploadButtonText?: string;
}

type DisabledUploadButtonConfig = NeverProps<EnabledUploadButtonConfig>;

type NeverProps<T> = { [P in keyof T]?: never; };
