import { CrisprFieldConfig } from '../models';

export interface CheckboxFieldConfig extends CrisprFieldConfig {
  labelPosition: 'before' | 'after';
  // TODO: @david I think we might be able to get rid of this after changing 'text' to 'label'
  inline: boolean;
}
