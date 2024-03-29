import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
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
  // changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    CrisprFieldDirective,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    CrisprPipesModule,
  ],
})
export class CrisprFormComponent implements OnInit {
  // if no form has been passed in by consuming component, we create an empty group to build out
  @Input() config: FormConfig;
  @Input() form: FormGroup = new FormGroup({});
  @Input() value: ControlGroupValue = null;

  @Output() submitted = new EventEmitter<FormGroup>();
  // proxy value and status change events through to consuming component
  @Output() valueChanges: Observable<any> = this.form.valueChanges;
  @Output() statusChanges: Observable<string> = this.form.statusChanges;

  @ViewChild('submitTrigger') submitTrigger: ElementRef<HTMLButtonElement>;

  ngOnInit() {
    // build out the form, note that we pass in the form as the third argument and the function modifies it
    buildFormGroupFromConfig(this.config, this.value, this.form);
  }

  handleSubmit() {
    this.form.markAllAsTouched();
    this.submitted.emit(this.form);
  }

  triggerSubmit() {
    this.submitTrigger.nativeElement.click();
  }
}
