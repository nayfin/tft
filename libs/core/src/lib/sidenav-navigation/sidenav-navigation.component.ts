import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

export interface SidenavSection {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  subsections?: SidenavSection[];
  links?: SidenavLink[];
}
export interface SidenavLink {
  title: string;
  path: string;
  description?: string;
  subtitle?: string;
  icon?: string;
}

@Component({
  selector: 'tft-sidenav-navigation',
  templateUrl: './sidenav-navigation.component.html',
  styleUrls: ['./sidenav-navigation.component.scss']
})
export class SidenavNavigationComponent implements OnInit {

  @Input() sections: SidenavSection[];
  // @Input() links: {};
  @Output() itemClicked = new EventEmitter<any>();

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  // want to allow any data to pass through here
  onItemClicked(item: SidenavLink) {
    this.itemClicked.emit(item);
    this.router.navigate([item.path]);
  }

}
