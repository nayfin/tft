import { FormGroup } from '@angular/forms';
import { FileUploadComponent } from '../material';
import { CrisprControlConfig, ControlType, ButtonType } from '../models';
// This is done different from the rest of the fields because
// when we use the heading inside of a field we don't want to have to
// pass a controlType
export interface FileUploadFieldConfig extends CrisprControlConfig {
  controlType: ControlType.FILE_UPLOAD;
  uploadFile?: (parentGroup: FormGroup, files:FileList, uploadComponent: FileUploadComponent) => Promise<unknown> | unknown;
  filesChanged?: (parentGroup: FormGroup, files: FileList) => void;
  allowMultipleFiles?: boolean;
  showDeleteButton?: boolean;
  showUploadButton?: boolean;
  acceptedTypes?: string;
  selectButtonText?: string;
  uploadButtonText?: string;
  selectFilesButtonType?: ButtonType;
  uploadButtonType?: ButtonType;
}
