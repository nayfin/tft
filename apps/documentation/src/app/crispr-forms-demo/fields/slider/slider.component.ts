import { Component } from '@angular/core';
import { FormConfig } from '@tft/crispr-forms';
import { sliderFormConfig } from './slider.config';

@Component({
    selector: 'doc-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    standalone: false
})
export class SliderComponent {

  formConfig: FormConfig = sliderFormConfig;

}
