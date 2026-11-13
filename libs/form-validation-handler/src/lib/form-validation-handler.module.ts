import { NgModule } from '@angular/core';
import { ControlErrorsDirective } from './directives/control-errors.directive';
import { ControlErrorsFormDirective } from './directives/control-errors-form.directive';
import { ControlErrorContainerDirective } from './directives/control-error-container.directive';

import { ControlErrorComponent } from './components/control-error/control-error.component';

const FORM_VALIDATION_HANDLER_PIECES = [
    ControlErrorsDirective,
    ControlErrorComponent,
    ControlErrorsFormDirective,
    ControlErrorContainerDirective,
];

/**
 * @deprecated Import the standalone pieces (ControlErrorsDirective, ControlErrorsFormDirective,
 * ControlErrorContainerDirective, ControlErrorComponent) directly.
 * This module will be removed in the next major version.
 */
@NgModule({
    imports: FORM_VALIDATION_HANDLER_PIECES,
    exports: FORM_VALIDATION_HANDLER_PIECES,
})
export class FormValidationHandlerModule { }
