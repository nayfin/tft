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
      title: 'CRISPR Forms',
      path: 'crispr-forms-demo',
      description: `Overview of CRISPR Forms`,
    }
  ];

  onLinkSelected(item: any) {
    this.sidenav.close();
  }
}
