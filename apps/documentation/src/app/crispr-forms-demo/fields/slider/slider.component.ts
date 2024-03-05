import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';

@Component({
  selector: 'doc-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  formConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.SLIDER,
        info: {
          content: 'You can use a tooltip on a slider'
        },
        label: 'Slider Field',
        controlName: 'sliderA',
        displayLimits: true, // default
        max: 80,
        min: 20,
        step: 1.5,
        discrete: true // default: false
      },
      {
        controlType: ControlType.SLIDER,
        info: {
          content: 'You can use a tooltip on a slider'
        },
        label: 'Slider Field',
        controlName: 'sliderB',
      },
      {
        controlType: ControlType.BUTTON,
        type: 'submit',
        callback: ({value}) => console.log({value}),
        label: 'Submit',
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
