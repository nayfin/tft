
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { InfoComponent } from '../info';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SelectOption } from '../../utils';

@Component({
  selector: 'crispr-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [InfoComponent],
})
export class OptionComponent {
  @Input() option: SelectOption;
}
