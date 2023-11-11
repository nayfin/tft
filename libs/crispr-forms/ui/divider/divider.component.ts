import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CrisprFieldComponent, DividerConfig } from '@tft/crispr-forms/utils';

@Component({
  selector: 'crispr-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDividerModule],
})
export class DividerComponent
  extends CrisprFieldComponent<DividerConfig>
  implements OnInit
{
  // TODO: pull in type after configs are better organized
  defaultConfig = {};
  ngOnInit() {
    super.ngOnInit();
  }
}
