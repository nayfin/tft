import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SelectOption } from '../../models';

@Component({
  selector: 'crispr-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent {

  @Input() option: SelectOption

}
