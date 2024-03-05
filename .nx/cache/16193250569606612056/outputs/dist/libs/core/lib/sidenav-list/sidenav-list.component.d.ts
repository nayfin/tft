import { EventEmitter } from '@angular/core';
import { SidenavSection, SidenavLink } from './sidenav-list.model';
import * as i0 from "@angular/core";
export declare class SidenavListComponent {
    sections: SidenavSection[];
    itemClicked: EventEmitter<SidenavLink>;
    onItemClicked(item: SidenavLink): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SidenavListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SidenavListComponent, "tft-sidenav-list", never, { "sections": { "alias": "sections"; "required": false; }; }, { "itemClicked": "itemClicked"; }, never, never, false, never>;
}
