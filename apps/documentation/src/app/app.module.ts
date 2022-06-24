import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AngularFireModule } from '@angular/fire';

// import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiImportsModule } from '@tft/ui-imports';
import { CoreModule } from '@tft/core';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';


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
    HttpClientModule,
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  bootstrap: [AppComponent],
  exports: [],
  providers: [
    {
        provide: MAT_DATE_LOCALE,
        useValue: enUS,
    },
  ],
})
export class AppModule { }
