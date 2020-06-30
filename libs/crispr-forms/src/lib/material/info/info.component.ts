import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Info } from '../../models';

@Component({
  selector: 'crispr-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent {

  @Input() info: Info;

}
