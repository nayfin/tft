import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormConfig, SubGroupConfig } from '../models';
import { crisprControlMixin, CrisprFieldComponent } from '../abstracts';


const FormGroupMixin = crisprControlMixin<SubGroupConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupComponent extends FormGroupMixin implements OnInit {
  group: FormGroup;

  ngOnInit() {
    super.ngOnInit();
  }
}
