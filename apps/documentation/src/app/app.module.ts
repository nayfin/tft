import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AngularFireModule } from '@angular/fire';

// import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@tft/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent],
    exports: [], imports: [BrowserModule,
        AppRoutingModule,
        MatSidenavModule,
        CoreModule,
        BrowserAnimationsModule,
        MatSnackBarModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
