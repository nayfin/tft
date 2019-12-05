import { CrisprFieldConfig } from '../models';

export interface CheckboxFieldConfig extends CrisprFieldConfig {
  labelPosition: 'before' | 'after';
  inline: boolean;
  text: string;
}
