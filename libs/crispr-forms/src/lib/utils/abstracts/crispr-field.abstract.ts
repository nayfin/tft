import type {
  CrisprFieldConfig,
} from '../models';
import { OnInit, Directive } from '@angular/core';

@Directive({
  standalone: true
})
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


