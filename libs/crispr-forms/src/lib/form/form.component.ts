import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormConfig } from '../models';
import { buildFormGroupFromConfig } from '../form.helpers';
import { Subscription, Observable } from 'rxjs';
@Component({
  selector: 'crispr-form',
  styleUrls: ['form.component.scss'],
  templateUrl: 'form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrisprFormComponent implements OnInit {
  // if no form has been passed in by consuming component, we create an empty group to build out
  @Input() form: FormGroup = new FormGroup({});
  @Input() config: FormConfig;
  @Input() value: any = null;

  @Output() submitted: EventEmitter<any> = new EventEmitter<any>();
  // proxy value and status change events through to consuming component
  @Output() valueChanges: Observable<any> = this.form.valueChanges;
  @Output() statusChanges: Observable<string> = this.form.statusChanges;

  subs: Subscription[] = [];
  constructor( ) { }

  ngOnInit() {
    // build out the form, not we pass in the form as the third argument and the function modifies it
    buildFormGroupFromConfig(this.config, this.value, this.form);
  }

  handleSubmit() {
    this.form.markAllAsTouched();
    this.submitted.emit(this.form);
  }
}
