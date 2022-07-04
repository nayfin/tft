import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SelectOption } from '../../models';
import { InfoComponent } from '../info/info.component';

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
