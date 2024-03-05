import { OnInit, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class HeaderComponent implements OnInit {
    menuClicked: EventEmitter<void>;
    title: string;
    subtitle: any;
    constructor();
    ngOnInit(): void;
    onMenuClicked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HeaderComponent, "tft-header", never, { "title": { "alias": "title"; "required": false; }; "subtitle": { "alias": "subtitle"; "required": false; }; }, { "menuClicked": "menuClicked"; }, never, never, false, never>;
}
