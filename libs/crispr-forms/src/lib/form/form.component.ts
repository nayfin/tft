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
  viewChild,
  inject
} from '@angular/core';
import { outputFromObservable, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, StatusChangeEvent } from '@angular/forms';
import { distinctUntilChanged, filter, skip, startWith, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrisprFieldDirective } from '../field.directive';
import { ControlErrorContainerDirective, ControlErrorsFormDirective } from '@tft/form-validation-handler';
import { InitialControlValuePipe } from '../pipes/initial-control-value.pipe';
import {
  ControlGroupValue,
  FormConfig,
  ImageProcessingState,
  InvalidField,
  buildFormGroupFromConfig,
  getInvalidFields,
  getProcessingState,
} from '../utils';
import { InvalidFieldsSnackBarComponent } from './invalid-fields-snack-bar/invalid-fields-snack-bar.component';

const DEFAULT_INVALID_ERRORS_DURATION = 8000;
const DEFAULT_INVALID_ERRORS_MAX = 5;
const DEFAULT_INVALID_ERRORS_DISMISS_LABEL = 'Dismiss';

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
        field.errorKey === other.errorKey
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
  private readonly snackBar = inject(MatSnackBar);

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

  /**
   * Whether any image upload field in the form is processing an image (`'processing'`) or failed to process
   * one (`'failed'`), otherwise `'idle'`, which is also the state of a form without image fields.
   * Use it to disable a Save button outside the form. Reactive, so it is safe to read in a template.
   */
  readonly processingState: Signal<ImageProcessingState> = computed(() => {
    this.formEventCount();
    return getProcessingState(this.form());
  });

  /**
   * Emits the new `processingState` whenever it changes. It does not emit the initial `'idle'`: seeding with
   * `'idle'` makes the first emission of `toObservable` a repeat that is dropped, while a form that is already
   * processing when it first emits is still reported.
   */
  processingStateChange = outputFromObservable(
    toObservable(this.processingState).pipe(
      startWith<ImageProcessingState>('idle'),
      distinctUntilChanged(),
      skip(1)
    )
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
      const invalidFields = this.invalidFields();
      this.invalidSubmit.emit(invalidFields);
      this.openInvalidErrors(invalidFields);
    }
  }

  /** Lists the invalid fields in a snack bar when the config opts in. Opening one replaces any that is open. */
  private openInvalidErrors(invalidFields: InvalidField[]) {
    const option = this.config().showInvalidErrors;
    if (!option || !invalidFields.length) {
      return;
    }
    const options = option === true ? {} : option;
    this.snackBar.openFromComponent(InvalidFieldsSnackBarComponent, {
      duration: options.duration ?? DEFAULT_INVALID_ERRORS_DURATION,
      data: {
        fields: invalidFields,
        maxErrors: options.maxErrors ?? DEFAULT_INVALID_ERRORS_MAX,
        dismissLabel: options.dismissLabel ?? DEFAULT_INVALID_ERRORS_DISMISS_LABEL,
      },
    });
  }

  private bumpFormEventCount() {
    this.formEventCount.update((count) => count + 1);
  }

  triggerSubmit() {
    this.submitTrigger().nativeElement.click();
  }
}
