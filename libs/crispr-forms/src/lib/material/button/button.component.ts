
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ButtonConfig } from '../../models';

@Component({
  selector: 'crispr-raised-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {

  config: ButtonConfig;
  group: FormGroup;

  get matButtonClass () {
    return this.config.buttonType ? `mat-${this.config.buttonType}-button` : '';
  }
  constructor() { }

  ngOnInit() {
  }
}