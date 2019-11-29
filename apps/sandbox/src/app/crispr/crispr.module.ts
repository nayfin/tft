import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrisprRoutingModule } from './crispr-routing.module';
import { DemoComponent } from './containers/demo/demo.component';
import { CrisprFormsModule } from '@tft/crispr-forms';


@NgModule({
  declarations: [DemoComponent],
  imports: [
    CommonModule,
    CrisprRoutingModule,
    CrisprFormsModule
  ]
})
export class CrisprModule { }
