import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { SelectOption } from '../../models';
import { InfoModule } from '../info/info.component';

@Component({
  selector: 'crispr-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent {

  @Input() option: SelectOption

}
@NgModule({
  imports: [
    CommonModule,
    InfoModule,
  ],
  exports: [
    OptionComponent
  ],
  declarations: [
    OptionComponent
  ]
})

export class OptionModule {
}
