import { CrisprFieldConfig, ControlType } from './crispr-field.config';
// This is done different from the rest of the fields because
// when we use the heading inside of a field we don't want to have to
// pass a controlType
export type DividerConfig = Omit<CrisprFieldConfig, 'label'> & {
  controlType?: ControlType.DIVIDER;
  vertical?: boolean;
};
