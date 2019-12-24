import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavSection, SidenavLink } from './sidenav-list.model';

@Component({
  selector: 'tft-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Input() sections: SidenavSection[];
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
