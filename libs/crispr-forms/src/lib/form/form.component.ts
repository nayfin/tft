import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  input,
  signal,
  OnInit,
  output,
  untracked,
  ElementRef,
  viewChild
} from '@angular/core';
import { outputFromObservable, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, StatusChangeEvent } from '@angular/forms';
import { filter, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CrisprFieldDirective } from '../field.directive';
import { ControlErrorContainerDirective, ControlErrorsFormDirective } from '@tft/form-validation-handler';
import { InitialControlValuePipe } from '../pipes/initial-control-value.pipe';
import {
  ControlGroupValue,
  FormConfig,
  InvalidField,
  buildFormGroupFromConfig,
  getInvalidFields,
} from '../utils';
/** Whether two lists describe the same invalid fields, so `invalidFields` keeps its array when nothing observable changed. */
function sameInvalidFields(a: InvalidField[], b: InvalidField[]): boolean {
  return (
    a.length === b.length &&
    a.every((field, i) => {
      const other = b[i];
      return (
        field.control === other.control &&
        field.path === other.path &&
        field.label === other.label &&
        field.message === other.message &&
        field.errorKey === other.errorKey &&
        field.testId === other.testId
      );
    })
  );
}

@Component({
  selector: 'crispr-form',
  styleUrls: ['form.component.scss'],
  templateUrl: 'form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    '[attr.data-density]': 'config().density ?? null',
  },
  imports: [
    CommonModule,
    CrisprFieldDirective,
    ReactiveFormsModule,
    ControlErrorContainerDirective,
    ControlErrorsFormDirective,
    InitialControlValuePipe
  ]
})
export class CrisprFormComponent implements OnInit {
  config = input.required<FormConfig>();
  form = input<FormGroup>(new FormGroup({}));
  value = input<ControlGroupValue>(null);

  submitted = output<FormGroup>();
  /**
   * Emits the invalid fields (the same list as `invalidFields`) when the form is submitted while invalid.
   * `submitted` still emits too, as it does for every submit.
   */
  invalidSubmit = output<InvalidField[]>();

  /**
   * Bumped on every status change of the form (a value change, `setErrors`, enable/disable, an added or removed control),
   * so `invalidFields` re-evaluates. Reading `form.errors` alone is not reactive in an OnPush or zoneless component.
   * Other events, such as touched or pristine changes, cannot change what is invalid.
   */
  private readonly formEventCount = signal(0);
  private readonly formEventsSubscription = toObservable(this.form)
    .pipe(
      switchMap((f) => f.events.pipe(filter((event) => event instanceof StatusChangeEvent))),
      takeUntilDestroyed()
    )
    .subscribe(() => this.bumpFormEventCount());

  /**
   * What is wrong with the form right now: one entry per invalid field, in config order, whether or not
   * the user has touched it. Reactive, so it is safe to read in a template.
   */
  readonly invalidFields: Signal<InvalidField[]> = computed(
    () => {
      this.formEventCount();
      const config = this.config();
      return getInvalidFields(config, this.form(), config.errorDictionary);
    },
    { equal: sameInvalidFields }
  );

  /** Patch form values whenever the [value] input changes without firing valueChanges. */
  private patchValueEffect = effect(() => {
    const value = this.value();
    untracked(() => {
      if (value) {
        this.form().patchValue(value, { emitEvent: false });
      }
    });
  });

  // proxy value and status change events through to consuming component
  valueChanges = outputFromObservable(
    toObservable(this.form).pipe(switchMap((f) => f.valueChanges))
  );
  statusChanges = outputFromObservable(
    toObservable(this.form).pipe(switchMap((f) => f.statusChanges))
  );

  readonly submitTrigger = viewChild<ElementRef<HTMLButtonElement>>('submitTrigger');

  ngOnInit() {
    // build out the form, note that we pass in the form as the third argument and the function modifies it
    buildFormGroupFromConfig(this.config(), this.value(), this.form());
    // the form was built before the events subscription may have started, so make sure invalidFields sees it
    this.bumpFormEventCount();
  }

  handleSubmit() {
    this.form().markAllAsTouched();
    this.submitted.emit(this.form());
    if (this.form().invalid) {
      // re-evaluate, so a change that emitted no event (such as `emitEvent: false`) is not missed
      this.bumpFormEventCount();
      this.invalidSubmit.emit(this.invalidFields());
    }
  }

  private bumpFormEventCount() {
    this.formEventCount.update((count) => count + 1);
  }

  triggerSubmit() {
    this.submitTrigger().nativeElement.click();
  }
}
