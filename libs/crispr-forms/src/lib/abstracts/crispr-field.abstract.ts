import type {
  CrisprFieldConfig,
} from '../models';
import { OnInit, Directive } from '@angular/core';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
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


