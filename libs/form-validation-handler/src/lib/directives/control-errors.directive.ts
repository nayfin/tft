import {
  Directive, OnInit, OnDestroy, ComponentRef, computed, signal,
  ViewContainerRef, HostListener, DestroyRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription, EMPTY, Observable, merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { defaultErrors, ErrorDictionary, lookupErrorMessage } from '../form-errors';
import { ControlErrorsFormDirective } from './control-errors-form.directive';
import { ControlErrorComponent } from '../components';
import { ControlErrorContainerDirective } from './control-error-container.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    // we want to hook into all formControls so we use these selectors
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[formControl], [formControlName]'
})
export class ControlErrorsDirective implements OnInit {

  destroyRef = inject(DestroyRef)
  ngControl = inject(NgControl, { self: true });
  form = inject(ControlErrorsFormDirective, { optional: true });
  controlErrorContainer = inject(ControlErrorContainerDirective, { optional: true });
  private vcr = inject(ViewContainerRef);

  ref: ComponentRef<ControlErrorComponent>;
  container: ViewContainerRef;
  submit$: Observable<string | never>;
  blur$ = new Subject<void>();
  subs: Subscription[] = [];
  private readonly errorsOverride = signal<ErrorDictionary | null>(null);
  /** The default errors merged with the form's `errorDictionary`, which is read each time so later changes apply. */
  private readonly mergedErrors = computed<ErrorDictionary>(() => {
    const errorDictionary = this.form?.errorDictionary();
    return errorDictionary
      ? { ...defaultErrors, ...errorDictionary }
      : defaultErrors;
  });
  /** The error messages in use. Assigning replaces the form's dictionary, as it did when this was a plain field. */
  get errors(): ErrorDictionary {
    return this.errorsOverride() ?? this.mergedErrors();
  }
  set errors(value: ErrorDictionary) {
    this.errorsOverride.set(value);
  }
  // we need to make our own Observable of the blur event as it's not provided by the formControl
  @HostListener('blur')
  handleBlur() {
    this.blur$.next();
  }

  constructor() {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.container = this.controlErrorContainer?.vcr || this.vcr;
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
    this.ref.setInput('text', text);
  }

  getErrorMessage() {
    return lookupErrorMessage(this.ngControl.errors, this.errors);
  }
}

