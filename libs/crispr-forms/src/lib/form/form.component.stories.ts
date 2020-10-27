import { text, number, boolean } from '@storybook/addon-knobs';
import { CrisprFormComponent } from './form.component';

export default {
  title: 'CrisprFormComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: CrisprFormComponent,
  props: {
    config: text('config', ),
    form: text('form', new FormGroup({})),
    value: text('value', null),
  }
})