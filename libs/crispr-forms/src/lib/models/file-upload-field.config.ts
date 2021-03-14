import { FormGroup } from '@angular/forms';
import { FileUploadComponent } from '../material';
import { CrisprControlConfig, ControlType, ButtonType, MatFieldProperties } from '../models';

export type FileUploadFieldConfig = CrisprControlConfig & MatFieldProperties & {
  controlType: ControlType.FILE_UPLOAD;
  label?: string;
  filesChanged?: (parentGroup: FormGroup, files: FileList) => void;
  allowMultipleFiles?: boolean;
  showDeleteButton?: boolean;
  acceptedTypes?: string;
  selectFilesButtonType?: ButtonType;
  selectButtonText?: string;
  dropZoneText?: string;
  // isolate possible configurations regarding upload to for user to properly type configuration
} & (EnabledUploadButtonConfig | DisabledUploadButtonConfig);

//
interface EnabledUploadButtonConfig {
  uploadFiles: (parentGroup: FormGroup, files:FileList, uploadComponent: FileUploadComponent) => Promise<unknown> | unknown;
  showUploadProgress?: boolean;
  disableOnUpload?: boolean;
  uploadButtonType?: ButtonType;
  uploadButtonText?: string;
}

type DisabledUploadButtonConfig = NeverProps<EnabledUploadButtonConfig>;

/**
 * Maps all property types to never.
 * Useful for using discriminating unions to refine properties
 * */
type NeverProps<T> = { [P in keyof T]: never; };

