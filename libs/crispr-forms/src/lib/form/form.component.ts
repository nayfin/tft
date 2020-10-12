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
  @Input() config: FormConfig;
  @Input() form: FormGroup = new FormGroup({});
  @Input() value = null;

  @Output() submitted = new EventEmitter<FormGroup>();
  // proxy value and status change events through to consuming component
  @Output() valueChanges: Observable<any> = this.form.valueChanges;
  @Output() statusChanges: Observable<string> = this.form.statusChanges;

  subs: Subscription[] = [];
  constructor( ) { }

  ngOnInit() {
    // build out the form, note that we pass in the form as the third argument and the function modifies it
    buildFormGroupFromConfig(this.config, this.value, this.form);
    // DEPRECATED: remove in v11
    if ('controlName' in this.config || 'controlType' in this.config) {
      console.warn('properties controlType and controlName are DEPRECATED and no longer used for FormConfig, please remove before v11. They are still required for SubGroupConfig')
    }
  }

  handleSubmit() {
    this.form.markAllAsTouched();
    this.submitted.emit(this.form);
  }
}
