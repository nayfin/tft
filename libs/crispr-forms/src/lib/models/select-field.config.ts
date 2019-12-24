import { ControlFieldConfig } from '../models';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

export interface SelectFieldConfig extends ControlFieldConfig {
  emptyOptionsMessage?: string;
  reactiveOptions?: boolean;
  multiple?: boolean;
  options: OptionsType;
}

export type OptionsType = SelectOption[] | Observable<SelectOption[]> | OptionsCallback | ReactiveOptionsCallback;

export type OptionsCallback = () => Promise<SelectOption[]>;
export type ReactiveOptionsCallback =  (group?: FormGroup) => Observable<SelectOption[]>
export interface SelectOption {
  label: string;
  value: any;
}

export const DEFAULT_EMPTY_OPTIONS_MESSAGE = 'No Items';
