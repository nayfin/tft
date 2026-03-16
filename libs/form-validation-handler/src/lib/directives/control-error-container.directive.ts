import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[controlErrorContainer], [formGroup]',
    standalone: false
})
export class ControlErrorContainerDirective {
  vcr = inject(ViewContainerRef);

}
