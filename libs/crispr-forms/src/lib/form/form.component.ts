import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  OnInit,
  output,
  untracked,
  ElementRef,
  viewChild
} from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CrisprFieldDirective } from '../field.directive';
import { ControlErrorContainerDirective, ControlErrorsFormDirective } from '@tft/form-validation-handler';
import { InitialControlValuePipe } from '../pipes/initial-control-value.pipe';
import {
  ControlGroupValue,
  FormConfig,
  buildFormGroupFromConfig,
} from '../utils';
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
  }

  handleSubmit() {
    this.form().markAllAsTouched();
    this.submitted.emit(this.form());
  }

  triggerSubmit() {
    this.submitTrigger().nativeElement.click();
  }
}
