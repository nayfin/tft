import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CrisprFieldComponent, HeadingConfig } from '../../utils';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InfoComponent } from '../info';

const defaultConfig: Partial<HeadingConfig> = {
  typographyClass: 'mat-h3',
};
@Component({
    selector: 'crispr-heading',
    templateUrl: './heading.component.html',
    styleUrls: ['./heading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatFormFieldModule, InfoComponent],
    standalone: true
})
export class HeadingComponent extends CrisprFieldComponent<HeadingConfig> {
  defaultConfig = defaultConfig;
}
