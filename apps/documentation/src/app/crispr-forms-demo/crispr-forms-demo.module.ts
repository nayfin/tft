import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { CrisprFormsModule } from '@tft/crispr-forms';
import { UiImportsModule } from '@tft/ui-imports';

import { CrisprFormsDemoRoutingModule } from './crispr-forms-demo-routing.module';
import { OverviewComponent } from './fields/overview/overview.component';

@NgModule({
  imports: [
    CommonModule,
    CrisprFormsModule,
    UiImportsModule,
    AngularFireStorageModule,
    CrisprFormsDemoRoutingModule
  ],
  declarations: [
    OverviewComponent
  ],
})
export class CrisprFormsDemoModule { }
