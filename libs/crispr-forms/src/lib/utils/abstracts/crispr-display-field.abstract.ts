import type {
  CrisprControlConfig,
} from '../models';
import { OnInit, Directive } from '@angular/core';
import { CrisprControlComponent } from './crispr-control.abstract';



@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class CrisprDisplayFieldComponent extends CrisprControlComponent<CrisprControlConfig> implements OnInit {
  index?: number;
}


