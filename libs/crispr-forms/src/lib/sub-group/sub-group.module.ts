import { NgModule } from '@angular/core';
import { SubGroupComponent } from './sub-group.component';

/**
 * @deprecated SubGroupComponent is now standalone. Import SubGroupComponent directly.
 * This module will be removed in the next major version.
 */
@NgModule({
  imports: [SubGroupComponent],
  exports: [SubGroupComponent],
})
export class SubGroupModule {
}
