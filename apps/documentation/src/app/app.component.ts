import { Component, ViewChild, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { appNavTree } from './app-nav-tree';
import { SidenavLink } from '@tft/core'

@Component({
  selector: 'tft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  private router = inject(Router);

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  title = 'app';

  linksToExamples = appNavTree;

  onLinkSelected(item: SidenavLink) {
    this.router.navigate([item.path]);
    this.sidenav.close();
  }
}
