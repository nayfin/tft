import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

export const fileUploadFormConfig: FormConfig = {
  autoComplete: 'off',
  fields: [
    {
      controlType: ControlType.FILE_UPLOAD,
      controlName: 'fileUpload',
      label: 'File Upload',
      allowMultipleFiles: true,
      dropZoneText: 'Drop files here',
      selectButtonText: 'Select Files',
      clearFilesButtonText: 'Clear',
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
    },
  ],
};
