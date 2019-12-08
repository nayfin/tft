import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig } from '@angular/material';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landscaping', pathMatch: 'full'},
  { path: 'landscaping', loadChildren: () => import('./landscaping/landscaping.module').then(m => m.LandscapingModule)},
  {
    path: 'shuffleboard',
    loadChildren: () => import('./shuffleboard/shuffleboard.module').then(m => m.ShuffleboardModule)
  },
  { path: 'crispr', loadChildren: () => import('./crispr/crispr.module').then(m => m.CrisprModule)},

];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
