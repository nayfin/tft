import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { HeadingConfig } from '../../models';
import { CrisprFieldComponent } from '../../abstracts';

const defaultConfig: Partial<HeadingConfig> = {
  typographyClass: 'mat-h3'
}
@Component({
  selector: 'crispr-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingComponent extends CrisprFieldComponent<HeadingConfig>{
  @Input() config: HeadingConfig;
  defaultConfig = defaultConfig;
}
