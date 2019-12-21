import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  title = 'app';

  linksToExamples = [
    {
      title: 'Home',
      path: 'home',
      description: `Overview of search components`,
    }
  ];

  onLinkSelected(item: any) {
    this.sidenav.close();
  }
}
