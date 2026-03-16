import type {
  CrisprFieldConfig,
  CrisprControlConfig,
} from '../models';
import { computed, Directive, input, signal, Input} from '@angular/core';

@Directive({
  standalone: true
})
export abstract class CrisprFieldComponent<C extends CrisprFieldConfig> {

  defaultConfig?: Partial<C>;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({alias: 'config'})
  set inputConfig(config: C) {
    this.updateConfig(config);
  }

  private updateConfig(inputConfig: C) {
    const mergedConfig = this.defaultConfig ? {...this.defaultConfig, ...inputConfig} : inputConfig;
    this.config.set(mergedConfig);
  }

  config = signal<C | null>(null);

  testIdPrefix = input<string | undefined>(undefined);

  testId = computed(() => {
    const controlName = (this.config() as unknown as CrisprControlConfig)?.controlName;
    if (!controlName) return undefined;
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}.${controlName}` : controlName;
  });
}


