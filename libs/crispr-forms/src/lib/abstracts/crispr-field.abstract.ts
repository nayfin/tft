import {
  CrisprFieldConfig,
} from '../models';
import { OnInit, Directive } from '@angular/core';

// export type Constructor<T> = new(...args: any[]) => T;

@Directive()
export abstract class CrisprFieldComponent<C extends CrisprFieldConfig> implements OnInit {
  config: C;
  defaultConfig?: Partial<C>

  ngOnInit() {
    this.applyDefaultConfig();
  }

  applyDefaultConfig() {
    this.config = this.defaultConfig ? {...this.defaultConfig, ...this.config} : this.config;
  }
}


