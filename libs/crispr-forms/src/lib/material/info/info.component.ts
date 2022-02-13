import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { Info } from '../../models';

@Component({
  selector: 'crispr-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent {

  @Input() info: Info;

}
@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatTooltipModule
    ],
    exports: [
        InfoComponent
    ],
    declarations: [
        InfoComponent
    ]
})

export class InfoModule {
}
