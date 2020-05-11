import { CrisprFieldConfig, ControlType } from '../models';
// This is done different from the rest of the fields because
// when we use the heading inside of a field we don't want to have to
// pass a controlType
export type HeadingConfig = Omit<CrisprFieldConfig, 'placeholder' | 'controlType'> & {
  // controlType is optional here because this component can be used as a crispr field where it needs a ControlType
  // or by a crispr field where it doesn't need a ControlType
  controlType?: ControlType.HEADING;
  typographyClass?: string
};
