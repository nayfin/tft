import { SidenavSection } from '@tft/core';

export const appNavTree: SidenavSection[] = [
  {
    title: 'CRISPR Forms',
    subtitle: 'DNA driven forms',
    description: `Overview of CRISPR Forms`,
    links: [
      {
        title: 'Overview',
        path: 'crispr-forms-demo/overview',
      }
    ],
    subsections: [
      {
        title: 'Fields',
        subtitle: 'Fields subtitle',
        description: 'Available configuration fields',
        links: [
          {
            title: 'Input Field',
            path: 'crispr-forms-demo/fields/input'
          },
          {
            title: 'Textarea Field',
            path: 'crispr-forms-demo/fields/textarea'
          },
          {
            title: 'Select Field',
            path: 'crispr-forms-demo/fields/select'
          },
          {
            title: 'Autocomplete Field',
            path: 'crispr-forms-demo/fields/autocomplete'
          },
          {
            title: 'Checkbox Field',
            path: 'crispr-forms-demo/fields/checkbox'
          },
          {
            title: 'Slider Field',
            path: 'crispr-forms-demo/fields/slider'
          },
          {
            title: 'Datepicker Field',
            path: 'crispr-forms-demo/fields/datepicker'
          },
          {
            title: 'Divider',
            path: 'crispr-forms-demo/fields/divider'
          },
          {
            title: 'Heading',
            path: 'crispr-forms-demo/fields/heading'
          },
          {
            title: 'Button',
            path: 'crispr-forms-demo/fields/button'
          },
        ]
      },
      {
        title: 'Reactive API',
        subtitle: 'Configure fields that react to other field values',
        description: 'Configure fields that react to other field values',
        links: [
          {
            title: 'Computed Field',
            description: `Compute field value to react to other field values in the parent form group`,
            path: 'crispr-forms-demo/computed-field'
          },
          {
            title: 'Disabled Field',
            description: `Dynamically disable fields`,
            path: 'crispr-forms-demo/disabled-field'
          }
        ]
      },
    ]
  },
  {
    title: 'Interact',
    subtitle: 'An Angular companion to the interactjs library',
    description: ``,
    links: [
      {
        title: 'Overview',
        path: 'interact-demo/overview',
      }
    ],
    subsections: [
      {
        title: 'Examples',
        links: [
          {title: 'Shuffleboard', path: 'interact-demo/shuffleboard'},
          {title: 'Landscaping', path: 'interact-demo/landscaping'}
        ]
      },
      // {
      //   title: 'APIs',
      //   links: [
      //     {title: 'Drag', path: 'interact-demo/shuffleboard'},
      //     {title: 'Drop', path: 'interact-demo/landscaping'}
      //   ]
      // }
    ]
  }
];