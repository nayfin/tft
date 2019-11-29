import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlErrorsDirective, ControlErrorsFormDirective, ControlErrorContainerDirective } from './directives';
import { ControlErrorComponent } from './components';

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
  ],
  entryComponents: [
    ControlErrorComponent
  ]
})
export class FormValidationHandlerModule { }
