import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InteractModule } from '@tft/interact';
import { RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landscaping', pathMatch: 'full'},
  { path: 'landscaping', loadChildren: () => import('./landscaping/landscaping.module').then(m => m.LandscapingModule)},
  { path: 'shuffleboard', loadChildren: () => import('./shuffleboard/shuffleboard.module').then(m => m.ShuffleboardModule)},
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
