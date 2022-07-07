import { text, number, boolean } from '@storybook/addon-knobs';
import { InfoComponent } from './info.component';

export default {
  title: 'InfoComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: InfoComponent,
  props: {
    info: text('info', ),
  }
})