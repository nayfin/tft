import {
  ControlFieldConfig,
  ControlValue,
  CrisprFieldConfig,
  SelectOption,
  AutocompleteFieldConfig,
  AutocompleteChiplistFieldConfig
} from '../models';
import { OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { observablifyOptions } from '../form.helpers';

// export type Constructor<T> = new(...args: any[]) => T;

export abstract class CrisprFieldComponent<C extends CrisprFieldConfig> implements OnInit {
  config: C;
  protected defaultConfig?: Partial<C>

  ngOnInit() {
    this.applyDefaultConfig();
  }

  applyDefaultConfig() {
    this.config = this.defaultConfig ? {...this.defaultConfig, ...this.config} : this.config;
  }
}


