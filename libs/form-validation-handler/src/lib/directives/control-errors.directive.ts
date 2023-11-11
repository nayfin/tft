import {
  Directive, Self, OnInit, OnDestroy, Optional, ComponentRef,
  ViewContainerRef, HostListener, DestroyRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription, EMPTY, Observable, merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { defaultErrors, ErrorDictionary } from '../form-errors';
import { ControlErrorsFormDirective } from './control-errors-form.directive';
import { ControlErrorComponent } from '../components';
import { ControlErrorContainerDirective } from './control-error-container.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  // we want to hook into all formControls so we use these selectors
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formControl], [formControlName]',
})
export class ControlErrorsDirective implements OnInit {

  destroyRef = inject(DestroyRef)
  @Self() ngControl = inject(NgControl);
  @Optional() form = inject(ControlErrorsFormDirective);
  @Optional() controlErrorContainer = inject(ControlErrorContainerDirective);
  private vcr = inject(ViewContainerRef);

  ref: ComponentRef<ControlErrorComponent>;
  container: ViewContainerRef;
  submit$: Observable<string | never>;
  blur$ = new Subject<void>();
  subs: Subscription[] = [];
  errors: ErrorDictionary;
  // we need to make our own Observable of the blur event as it's not provided by the formControl
  @HostListener('blur')
  handleBlur() {
    this.blur$.next();
  }

  constructor(
    
  ) {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.container = this.controlErrorContainer?.vcr || this.vcr;
    this.errors = this.form?.errorDictionary
      ? { ...defaultErrors, ...this.form.errorDictionary}
      : defaultErrors;
  }

  ngOnInit() {
    // build array of subscriptions
    if(!this.ngControl) console.log('onInit', this.ngControl);
    if (this.ngControl) {
      this.getInteractionHandler().pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
    }
  }



  // merges ui events into a single stream and handles events displaying errors when appropriate
  getInteractionHandler() {
    if( !this.ngControl.statusChanges) {
      console.log('broke', {ngControl: this.ngControl})
    } else {
      console.log({ngControl: this.ngControl})
    }

    return merge(
      this.submit$,
      this.blur$,
      this.ngControl.valueChanges,
      this.ngControl.statusChanges
    ).pipe(
      tap( event => {
        // prevents displaying error messages before user interaction unless submitting
        if (this.ngControl.touched || ['submitted', 'VALID'].includes(event)) {
          const errorMessage = this.getErrorMessage();
          this.setError(errorMessage);
          // Trigger warning colors in UI of invalid fields
          if (event === 'submitted') {
            this.ngControl?.control.updateValueAndValidity();
          }
        }
      })
    );
  }

  setError(text: string) {
    if (!this.ref) {
      this.ref = this.container.createComponent(ControlErrorComponent);
    }
    this.ref.instance.text = text;
  }

  getErrorMessage() {
    const controlErrors = this.ngControl.errors;
    if (controlErrors) {
      const firstKey = Object.keys(controlErrors)[0];
      const getError = this.errors[firstKey] || this.errors['default'];
      const text = getError(controlErrors[firstKey]);
      return text;
    } else {
      return null;
    }
  }
}

