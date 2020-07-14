import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubGroupConfig } from '../models';
import { crisprControlMixin, CrisprFieldComponent } from '../abstracts';


const FormGroupMixin = crisprControlMixin<SubGroupConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-sub-group',
  templateUrl: './sub-group.component.html',
  styleUrls: ['./sub-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubGroupComponent extends FormGroupMixin implements OnInit {
  group: FormGroup;

  ngOnInit() {
    super.ngOnInit();
  }
}
