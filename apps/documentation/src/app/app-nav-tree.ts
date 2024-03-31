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
            title: 'File Upload Field',
            path: 'crispr-forms-demo/fields/file-upload'
          },
          {
            title: 'Image Upload Field',
            path: 'crispr-forms-demo/fields/image-upload'
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
            title: 'Autocomplete Chiplist Field',
            path: 'crispr-forms-demo/fields/autocomplete-chiplist'
          },
          {
            title: 'Unit Conversion Field',
            path: 'crispr-forms-demo/fields/unit-conversion'
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
        title: 'Field Feature',
        subtitle: 'Configure fields that react to other field values',
        description: 'Configure fields that react to other field values',
        links: [
          {
            title: 'Color',
            description: `Take advantage of Material Theme colors`,
            path: 'crispr-forms-demo/features/color'
          },
          {
            title: 'Appearance',
            description: `All the Material appearance options are available`,
            path: 'crispr-forms-demo/features/appearance'
          },
          {
            title: 'Info',
            description: `A handy way to provide users more data via a tooltip`,
            path: 'crispr-forms-demo/features/info'
          },
          {
            title: 'Suffix',
            description: `Helpful for adding units to fields`,
            path: 'crispr-forms-demo/features/suffix'
          },
          {
            title: 'Computed Field',
            description: `Compute field value to react to other field values in the parent form group`,
            path: 'crispr-forms-demo/features/computed-field'
          },
          {
            title: 'Disabled Field',
            description: `Dynamically disable fields`,
            path: 'crispr-forms-demo/features/disabled-field'
          },
          {
            title: 'Custom Components',
            description: `Pass custom components to form generator`,
            path: 'crispr-forms-demo/features/custom-component'
          },
          {
            title: 'Validators',
            description: `Helpful Validators`,
            path: 'crispr-forms-demo/features/validators'
          },
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
      {
        title: 'Features',
        subsections: [
          {
            title: 'Drag',
            links: [
              { title: 'Placeholder Template', path: 'interact-demo/features/drag/placeholder-template' }
            ]
          },
          {
            title: 'Gestures',
            links: [
              { title: 'Pinch To Zoom', path: 'interact-demo/features/gestures/pinch-to-zoom' }
            ]
          }
        ]
      }
    ]
  },
  // {
  //   title: 'Material Instantsearch',
  //   subtitle: 'Material Design Algolia Instantsearch components',
  //   description: ``,
  //   links: [
  //     {
  //       title: 'Overview',
  //       path: 'mat-instantsearch-demo/overview',
  //     }
  //   ],
  //   subsections: [
  //     {
  //       title: 'Search Components',
  //       links: [
  //         {title: 'Search Box', path: 'mat-instantsearch-demo/components/search-box'},
  //         {title: 'Autocomplete', path: 'mat-instantsearch-demo/components/autocomplete'},
  //         {title: 'Select Filter', path: 'mat-instantsearch-demo/components/filter-select'},
  //         {title: 'Chiplist Filter', path: 'mat-instantsearch-demo/components/filter-chiplist'},
  //         {title: 'Pagination', path: 'mat-instantsearch-demo/components/pagination'},
  //       ]
  //     }
  //   ]
  // }
];
