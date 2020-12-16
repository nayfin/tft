import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UiImportsModule } from '@tft/ui-imports';

import { HeaderComponent } from './header/header.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';

const CORE_COMPONENTS = [
  HeaderComponent,
  SidenavListComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiImportsModule
  ],
  declarations: CORE_COMPONENTS,
  exports: CORE_COMPONENTS,
})

export class CoreModule { }
