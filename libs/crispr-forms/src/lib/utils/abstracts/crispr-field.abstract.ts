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

  // eslint-disable-next-line @angular-eslint/no-input-rename -- `config` is the public binding name consumers use (<tft-input-field [config]=...>); the `config` computed below holds the merged value
  inputConfig = input<C | null>(null, { alias: 'config' });

  config = computed<C | null>(() => {
    const c = this.inputConfig();
    return c && this.defaultConfig ? { ...this.defaultConfig, ...c } : c;
  });

  testIdPrefix = input<string | undefined>(undefined);

  testId = computed(() => {
    const config = this.config();
    const id = config?.testId || (config as unknown as CrisprControlConfig)?.controlName;
    if (!id) return undefined;
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}.${id}` : id;
  });

}


