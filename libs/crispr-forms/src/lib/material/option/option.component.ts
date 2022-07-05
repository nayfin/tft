import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { InfoComponent } from '../info/info.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SelectOption } from '@tft/crispr-forms/utils';

@Component({
  selector: 'crispr-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InfoComponent,
  ],
})
export class OptionComponent {

  @Input() option: SelectOption

}
