import type {
  CrisprControlConfig,
} from '../models';
import { OnInit, Directive } from '@angular/core';
import { CrisprFieldComponent } from './crispr-field.abstract';
import { crisprControlMixin } from './crispr-control.mixin';

const CrisprDisplayFieldMixin = crisprControlMixin<CrisprControlConfig>(CrisprFieldComponent);


@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class CrisprDisplayFieldComponent extends CrisprDisplayFieldMixin implements OnInit {
  index?: number;
}


