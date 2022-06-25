import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AngularFireStorageModule } from '@angular/fire/storage';

import { CrisprFormsModule } from '@tft/crispr-forms';

import { CrisprFormsDemoRoutingModule } from './crispr-forms-demo-routing.module';
import { OverviewComponent } from './fields/overview/overview.component';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';

@NgModule({
  imports: [
    CommonModule,
    CrisprFormsModule,
    MatCardModule,
    CrisprFormsDemoRoutingModule
    // AngularFireStorageModule,

  ],
  declarations: [
    OverviewComponent
  ],
  providers: [
    {
        provide: MAT_DATE_LOCALE,
        useValue: enUS,
    },
  ],

})
export class CrisprFormsDemoModule { }
