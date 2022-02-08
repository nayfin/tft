import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlErrorsDirective } from './directives/control-errors.directive';
import { ControlErrorsFormDirective } from './directives/control-errors-form.directive';
import { ControlErrorContainerDirective } from './directives/control-error-container.directive';

import { ControlErrorComponent } from './components/control-error/control-error.component';

@NgModule({
    declarations: [
        ControlErrorsDirective,
        ControlErrorComponent,
        ControlErrorsFormDirective,
        ControlErrorContainerDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ControlErrorsDirective,
        ControlErrorComponent,
        ControlErrorsFormDirective,
        ControlErrorContainerDirective,
    ]
})
export class FormValidationHandlerModule { }
