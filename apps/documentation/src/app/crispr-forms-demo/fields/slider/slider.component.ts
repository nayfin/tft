import { Component } from '@angular/core';
import { FormConfig, CrisprFormComponent } from '@tft/crispr-forms';
import { sliderFormConfig } from './slider.config';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'doc-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    imports: [MatCard, CrisprFormComponent]
})
export class SliderComponent {

  formConfig: FormConfig = sliderFormConfig;

}
