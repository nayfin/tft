import { FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { TooltipPosition, ThemePalette, MatFormFieldAppearance } from '@angular/material';
import { ErrorDictionary } from '@tft/form-validation-handler';
import { AutocompleteFieldConfig } from '../models';
import { FormGroupListConfig } from '../form-group-list/form-group-list.config';
import { ComputeFieldConfig, CheckControlConfig, CheckControlsConfig } from '../form.helpers';
import { SelectFieldConfig, DatepickerFieldConfig, InputFieldConfig, CheckboxFieldConfig, TextareaFieldConfig } from '../models';

interface CrisprFieldConfig {
  controlName: string;
  controlType: ControlType;
  label?: string;
  placeholder?: string;
  info?: {
    content: string;
    tooltipPosition?: TooltipPosition;
  };
  classes?: string[];
  appearance?: MatFormFieldAppearance;
  color?: ThemePalette;
  computeField?: ( group: FormGroup, config: any) => Observable<any>;
  computeFieldConfig?: ComputeFieldConfig | any;
  // function that returns an observable that resolves to a boolean
  showField?: (group: FormGroup, config?: any ) => Observable<boolean>;
  showFieldConfig?: CheckControlConfig | CheckControlsConfig | any; // any is required for user defined configs
  validators?: ValidatorFn[];
  value?: string | number;
}

interface FormConfig {
  controlType?: ControlType;
  controlName: string;
  label?: string;
  errorDictionary?: ErrorDictionary;
  autocomplete?: 'off' | 'on';
  fields: AnyFieldConfig[];
}

type AnyFieldConfig = CrisprFieldConfig
  | SelectFieldConfig
  | InputFieldConfig
  | FormGroupListConfig
  | FormConfig
  | AutocompleteFieldConfig
  | TextareaFieldConfig
  | CheckboxFieldConfig
  | DatepickerFieldConfig;

enum ControlType {
  AUTOCOMPLETE = 'autocomplete',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  BUTTON = 'button',
  GROUP = 'group',
  GROUP_LIST = 'groupList',
  DATEPICKER = 'datepicker'
}

export {ControlType, AnyFieldConfig, CrisprFieldConfig, FormGroupListConfig, FormConfig};
