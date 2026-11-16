import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector -- also attaches to every Angular `[formGroup]` automatically; the selector is public API
    selector: '[controlErrorContainer], [formGroup]'
})
export class ControlErrorContainerDirective {
  vcr = inject(ViewContainerRef);

}
