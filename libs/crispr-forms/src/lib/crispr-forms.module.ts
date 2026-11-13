import { NgModule } from '@angular/core';

import { CrisprFormComponent } from './form/form.component';
import { FieldContainerComponent } from './ui';

/**
 * @deprecated Import the standalone pieces (CrisprFormComponent, FieldContainerComponent, …) directly.
 * This module will be removed in the next major version.
 */
@NgModule({
  imports: [CrisprFormComponent, FieldContainerComponent],
  exports: [CrisprFormComponent, FieldContainerComponent],
})
export class CrisprFormsModule {}
