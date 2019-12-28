import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';

@Component({
  selector: 'ng-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  formConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'form',
    fields: [
      {
        controlType: ControlType.SLIDER,
        info: {
          content: 'You can use a tooltip on a slider'
        },
        label: 'Slider Field',
        controlName: 'slider',
        displayLimits: true, // default
        max: 80,
        min: 20,
        step: 1.5,
        thumbLabel: true // default: false
      },
      {
        controlType: ControlType.SLIDER,
        info: {
          content: 'You can use a tooltip on a slider'
        },
        vertical: true,
        label: 'Slider Field',
        controlName: 'slider',
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
