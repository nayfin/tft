import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { INTERACT_ROOT_CONFIG, InteractRootConfig } from './models';
import { InteractService } from './services/interact.service';

/**
 * Provides the interact configuration and `InteractService`.
 *
 * Add it to the application providers, or to a route's `providers` to scope it to that route.
 * Options that are left out fall back to the defaults (`cssDimensionUnit: 'px'`).
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [provideInteract({ cssDimensionUnit: 'em' })],
 * });
 */
export function provideInteract(
  config: Partial<InteractRootConfig> = {}
): EnvironmentProviders {
  const defaultConfig: InteractRootConfig = { cssDimensionUnit: 'px' };
  return makeEnvironmentProviders([
    {
      provide: INTERACT_ROOT_CONFIG,
      useValue: { ...defaultConfig, ...config },
    },
    InteractService,
  ]);
}
