import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CrisprFieldComponent, HeadingConfig } from '@tft/crispr-forms/utils';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InfoComponent } from '../info/info.component';

const defaultConfig: Partial<HeadingConfig> = {
  typographyClass: 'mat-h3'
}
@Component({
  selector: 'crispr-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    InfoComponent
  ],
})
export class HeadingComponent extends CrisprFieldComponent<HeadingConfig>{
  @Input() config: HeadingConfig;
  defaultConfig = defaultConfig;
}
