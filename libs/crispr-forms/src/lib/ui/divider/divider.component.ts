import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CrisprFieldComponent, DividerConfig } from '../../utils';

@Component({
    selector: 'crispr-divider',
    templateUrl: './divider.component.html',
    styleUrls: ['./divider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatDividerModule],
    standalone: true
})
export class DividerComponent
  extends CrisprFieldComponent<DividerConfig>
{
  // TODO: pull in type after configs are better organized
  defaultConfig = {};
}
