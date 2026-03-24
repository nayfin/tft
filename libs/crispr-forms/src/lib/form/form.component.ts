import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CrisprFieldDirective } from '../field.directive';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { CrisprPipesModule } from '../pipes/crispr-pipes.module';
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
  imports: [
    CommonModule,
    CrisprFieldDirective,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    CrisprPipesModule,
  ]
})
export class CrisprFormComponent implements OnInit {
  config = input.required<FormConfig>();
  form = input<FormGroup>(new FormGroup({}));
  value = input<ControlGroupValue>(null);

  submitted = output<FormGroup>();
  // proxy value and status change events through to consuming component
  valueChanges = outputFromObservable(
    toObservable(this.form).pipe(switchMap((f) => f.valueChanges))
  );
  statusChanges = outputFromObservable(
    toObservable(this.form).pipe(switchMap((f) => f.statusChanges))
  );

  @ViewChild('submitTrigger') submitTrigger: ElementRef<HTMLButtonElement>;

  ngOnInit() {
    // build out the form, note that we pass in the form as the third argument and the function modifies it
    buildFormGroupFromConfig(this.config(), this.value(), this.form());
  }

  handleSubmit() {
    this.form().markAllAsTouched();
    this.submitted.emit(this.form());
  }

  triggerSubmit() {
    this.submitTrigger.nativeElement.click();
  }
}
