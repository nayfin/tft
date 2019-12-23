import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFireStorageModule } from '@angular/fire/storage';
// import { AngularFirestoreModule } from '@angular/fire/firestore';

// import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiImportsModule } from '@tft/ui-imports';
import { CoreModule } from '@tft/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiImportsModule,
    CoreModule,
    BrowserAnimationsModule,
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireStorageModule,
    // AngularFirestoreModule
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
