import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormConfig } from '../models';
import { FieldContainerComponent } from '../field-container/field-container.component';

@Component({
  selector: 'crispr-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupComponent extends FieldContainerComponent implements OnInit {

  @Input() config: FormConfig;

  group: FormGroup;
  subGroup: AbstractControl;

  constructor() {
    super();
  }

  ngOnInit() {
    this.subGroup = this.group.get(this.config.controlName);
    this.showField = this.connectShowField(this.group, this.config);
  }
}
