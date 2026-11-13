import { NgModule } from '@angular/core';

import { HeaderComponent } from './header/header.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';

const CORE_COMPONENTS = [
  HeaderComponent,
  SidenavListComponent,
];

/**
 * @deprecated Import the standalone components (HeaderComponent, SidenavListComponent) directly.
 * This module will be removed in the next major version.
 */
@NgModule({
  imports: CORE_COMPONENTS,
  exports: CORE_COMPONENTS,
})
export class CoreModule { }
