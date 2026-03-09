import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

export const sliderFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.SLIDER,
      label: 'Slider Field',
      controlName: 'sliderA',
      displayLimits: true,
      max: 80,
      min: 20,
      step: 1,
      discrete: true,
    },
    {
      controlType: ControlType.SLIDER,
      label: 'Simple Slider',
      controlName: 'sliderB',
    },
    {
      controlType: ControlType.BUTTON,
      type: 'submit',
      label: 'Submit',
    },
  ],
};
