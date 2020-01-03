import { CrisprFieldConfig } from '../models';
// This is done different from the rest of the fields because
// when we use the heading inside of a field we don't want to have to
// pass a controlType
export type HeadingConfig = Partial<CrisprFieldConfig> & { typographyClass?: string};
