import { Component, input, output } from '@angular/core';
import { SidenavSection, SidenavLink } from './sidenav-list.model';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatLine } from '@angular/material/core';

@Component({
    selector: 'tft-sidenav-list',
    templateUrl: './sidenav-list.component.html',
    styleUrls: ['./sidenav-list.component.scss'],
    imports: [MatNavList, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, MatListItem, MatIcon, MatTooltip, MatLine]
})
export class SidenavListComponent {

  readonly sections = input<SidenavSection[]>(undefined);
  readonly itemClicked = output<SidenavLink>();

  // want to allow any data to pass through here
  onItemClicked(item: SidenavLink) {
    this.itemClicked.emit(item);
  }

}
