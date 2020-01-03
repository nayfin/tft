import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { HeadingConfig } from '../../models';

@Component({
  selector: 'crispr-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingComponent {
  @Input() config: HeadingConfig;
}
