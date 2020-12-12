import { CrisprControlConfig } from '../models';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ControlType, FieldDescriptors, MatFieldProperties } from './crispr-field.config';

export interface SelectFieldConfig extends Omit<CrisprControlConfig, 'placeholder'>,
  FieldDescriptors,
  MatFieldProperties {
  controlType: ControlType.SELECT,
  emptyOptionsMessage?: string;
  multiple?: boolean;
  enableToggleAll?: boolean;
  options: OptionsType;
}

export type OptionsType = SelectOption[] | Observable<SelectOption[]> | OptionsCallback | Promise<SelectOption[]>;

export type OptionsCallback = (group?: FormGroup) => OptionsType;
export type ReactiveOptionsCallback =  (group?: FormGroup) => Observable<SelectOption[]>;
// tslint:disable-next-line: max-line-length
export type AutocompleteOptionsCallback = (group?: FormGroup, searchTerm?: string) => OptionsType;
export interface SelectOption {
  label: string;
  value: any;
  imageUrl?: string;
}

export const DEFAULT_EMPTY_OPTIONS_MESSAGE = 'No Items';
