import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TextareaFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';

const defaultConfig: Partial<TextareaFieldConfig> = {rows: 5};
const TextareaFieldMixin = crisprControlMixin<TextareaFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-textarea-field',
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaFieldComponent extends TextareaFieldMixin implements OnInit {
  defaultConfig = defaultConfig;

  ngOnInit() {
    super.ngOnInit()
  }
}

