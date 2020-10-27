import { text, number, boolean } from '@storybook/addon-knobs';
import { OptionComponent } from './option.component';

export default {
  title: 'OptionComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: OptionComponent,
  props: {
    option: text('option', ),
  }
})