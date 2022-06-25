import { Component, NgModule, OnInit } from '@angular/core';
import { DividerConfig } from '../../models';
import { CrisprFieldComponent } from '../../abstracts';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'crispr-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent extends CrisprFieldComponent<DividerConfig> implements OnInit {
  // TODO: pull in type after configs are better organized
  defaultConfig = {};
  ngOnInit() {
    super.ngOnInit();
  }

}
@NgModule({
  imports: [
    CommonModule,
    MatDividerModule
  ],
  exports: [
    DividerComponent
  ],
  declarations: [
    DividerComponent
  ]
})
export class DividerModule {
}
