import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SliderFieldConfig } from '../../models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'crispr-slider-field',
  templateUrl: './slider-field.component.html',
  styleUrls: ['./slider-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderFieldComponent implements OnInit {

  config: SliderFieldConfig;
  group: FormGroup;
  get flexDirection() {
    return this.config.vertical ? 'column' : 'row';
  }
  get displayLimits() {
    // returns true if displayLimits is undefined or true
    return this.config.displayLimits === undefined || this.config.displayLimits;
  }
  constructor() { }

  ngOnInit() {
  }

}
