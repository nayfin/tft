import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormConfig } from '../models';
import { crisprControlMixin, CrisprFieldComponent } from '../abstracts';


const FormGroupMixin = crisprControlMixin<FormConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupComponent extends FormGroupMixin implements OnInit {
  ngOnInit() {
    super.ngOnInit();
  }
}
