import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavSection } from 'libs/core/src/lib/sidenav-navigation/sidenav-navigation.component';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  title = 'app';

  linksToExamples: SidenavSection[] = [
    {
      title: 'CRISPR Forms',
      subtitle: 'DNA driven forms',
      description: `Overview of CRISPR Forms`,
      links: [
        {
          title: 'Overview',
          path: 'crispr-forms-demo/overview',
        }
      ],
      subsections: [
        {
          title: 'Fields',
          subtitle: 'Fields subtitle',
          description: 'Available configuration fields',
          links: [
            {
              title: 'Select Field',
              path: 'crispr-forms-demo/select'
            }
          ]
        }
      ]
    },
    {
      title: 'Interact',
      subtitle: 'An Angular companion to the interactjs library',
      description: ``,
      links: [
        {
          title: 'Overview',
          path: 'interact-demo/overview',
        }
      ],
      subsections: [
        {
          title: 'Examples',
          links: [
            {title: 'Shuffleboard', path: 'interact-demo/shuffleboard'},
            {title: 'Landscaping', path: 'interact-demo/landscaping'}
          ]
        },
        {
          title: 'APIs',
          links: [
            {title: 'Drag', path: 'interact-demo/shuffleboard'},
            {title: 'Drop', path: 'interact-demo/landscaping'}
          ]
        }
      ]
    }
  ];

  onLinkSelected(item: any) {
    this.sidenav.close();
  }
}
