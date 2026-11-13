import { Component, inject, viewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { appNavTree } from './app-nav-tree';
import { HeaderComponent, SidenavLink, SidenavListComponent } from '@tft/core';

@Component({
  selector: 'tft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [HeaderComponent, SidenavListComponent, MatSidenav, MatSidenavContainer, MatSidenavContent, RouterOutlet],
})
export class AppComponent {
  private router = inject(Router);

  readonly sidenav = viewChild<MatSidenav>('sidenav');
  title = 'app';

  linksToExamples = appNavTree;

  onLinkSelected(item: SidenavLink) {
    this.router.navigate([item.path]);
    this.sidenav().close();
  }
}
