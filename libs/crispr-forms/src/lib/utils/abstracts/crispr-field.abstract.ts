import type {
  CrisprFieldConfig,
  CrisprControlConfig,
} from '../models';
import { computed, Directive, input } from '@angular/core';

@Directive({
  standalone: true
})
export abstract class CrisprFieldComponent<C extends CrisprFieldConfig> {

  defaultConfig?: Partial<C>;

  inputConfig = input<C | null>(null, { alias: 'config' });

  config = computed<C | null>(() => {
    const c = this.inputConfig();
    return c && this.defaultConfig ? { ...this.defaultConfig, ...c } : c;
  });

  testIdPrefix = input<string | undefined>(undefined);

  testId = computed(() => {
    const controlName = (this.config() as unknown as CrisprControlConfig)?.controlName;
    if (!controlName) return undefined;
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}.${controlName}` : controlName;
  });

}


