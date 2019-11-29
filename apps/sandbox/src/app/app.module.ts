import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
