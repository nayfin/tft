import { Component, Input, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { HeadingConfig } from '../../models';
import { CrisprFieldComponent } from '../../abstracts';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InfoModule } from '../info/info.component';

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
@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    InfoModule
  ],
  exports: [
    HeadingComponent
  ],
  declarations: [
    HeadingComponent
  ],
  entryComponents: [
    HeadingComponent
  ]
})

export class HeadingModule {
}
