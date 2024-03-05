import * as i0 from '@angular/core';
import { EventEmitter, Component, Output, Input, NgModule } from '@angular/core';
import * as i1$1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1 from '@angular/material/toolbar';
import { MatToolbarModule } from '@angular/material/toolbar';
import * as i2 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i3 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import * as i3$1 from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import * as i4 from '@angular/material/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as i5 from '@angular/material/list';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

class HeaderComponent {
    constructor() {
        this.menuClicked = new EventEmitter();
        this.title = 'Tortilla Flat Tech';
    }
    ngOnInit() {
    }
    onMenuClicked() {
        this.menuClicked.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.1", ngImport: i0, type: HeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.1", type: HeaderComponent, selector: "tft-header", inputs: { title: "title", subtitle: "subtitle" }, outputs: { menuClicked: "menuClicked" }, ngImport: i0, template: "<mat-toolbar>\n  <button mat-icon-button (click)=\"onMenuClicked()\">\n    <mat-icon>menu</mat-icon>\n  </button>\n  <strong>{{ title }} </strong><span class=\"sub-title\">{{subtitle}}</span>\n\n</mat-toolbar>\n", styles: [".sub-title{margin:0 12px}\n"], dependencies: [{ kind: "component", type: i1.MatToolbar, selector: "mat-toolbar", inputs: ["color"], exportAs: ["matToolbar"] }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: i3.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.1", ngImport: i0, type: HeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tft-header', template: "<mat-toolbar>\n  <button mat-icon-button (click)=\"onMenuClicked()\">\n    <mat-icon>menu</mat-icon>\n  </button>\n  <strong>{{ title }} </strong><span class=\"sub-title\">{{subtitle}}</span>\n\n</mat-toolbar>\n", styles: [".sub-title{margin:0 12px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { menuClicked: [{
                type: Output
            }], title: [{
                type: Input
            }], subtitle: [{
                type: Input
            }] } });

class SidenavListComponent {
    constructor() {
        this.itemClicked = new EventEmitter();
    }
    // want to allow any data to pass through here
    onItemClicked(item) {
        this.itemClicked.emit(item);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.1", ngImport: i0, type: SidenavListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.1", type: SidenavListComponent, selector: "tft-sidenav-list", inputs: { sections: "sections" }, outputs: { itemClicked: "itemClicked" }, ngImport: i0, template: "<mat-nav-list>\n\n  <mat-accordion>\n    <mat-expansion-panel *ngFor=\"let section of sections\">\n      <mat-expansion-panel-header>\n        <mat-panel-title>\n          {{section.title}}\n        </mat-panel-title>\n        <mat-panel-description>\n          {{section.subtitle}}\n        </mat-panel-description>\n      </mat-expansion-panel-header>\n      <mat-list-item\n        *ngFor=\"let link of section.links\"\n        (click)=\"onItemClicked(link)\">\n\n        <a matLine>\n          {{ link.title }}\n        </a>\n        <mat-icon *ngIf=\"!!link.description\"\n          [matTooltip]=\"link.description || 'Description coming soon!'\">\n          info\n        </mat-icon>\n      </mat-list-item>\n      <tft-sidenav-list\n        [sections]=\"section.subsections\"\n        (itemClicked)=\"onItemClicked($event)\">\n      </tft-sidenav-list>\n    </mat-expansion-panel>\n  </mat-accordion>\n</mat-nav-list>", styles: ["mat-expansion-panel{margin:8px}::ng-deep .mat-expansion-panel-content .mat-expansion-panel-body{padding:0 0 12px}\n"], dependencies: [{ kind: "directive", type: i1$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: i3$1.MatAccordion, selector: "mat-accordion", inputs: ["multi", "hideToggle", "displayMode", "togglePosition"], exportAs: ["matAccordion"] }, { kind: "component", type: i3$1.MatExpansionPanel, selector: "mat-expansion-panel", inputs: ["disabled", "expanded", "hideToggle", "togglePosition"], outputs: ["opened", "closed", "expandedChange", "afterExpand", "afterCollapse"], exportAs: ["matExpansionPanel"] }, { kind: "component", type: i3$1.MatExpansionPanelHeader, selector: "mat-expansion-panel-header", inputs: ["tabIndex", "expandedHeight", "collapsedHeight"] }, { kind: "directive", type: i3$1.MatExpansionPanelTitle, selector: "mat-panel-title" }, { kind: "directive", type: i3$1.MatExpansionPanelDescription, selector: "mat-panel-description" }, { kind: "directive", type: i4.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }, { kind: "component", type: i5.MatNavList, selector: "mat-nav-list", exportAs: ["matNavList"] }, { kind: "component", type: i5.MatListItem, selector: "mat-list-item, a[mat-list-item], button[mat-list-item]", inputs: ["activated"], exportAs: ["matListItem"] }, { kind: "component", type: SidenavListComponent, selector: "tft-sidenav-list", inputs: ["sections"], outputs: ["itemClicked"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.1", ngImport: i0, type: SidenavListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tft-sidenav-list', template: "<mat-nav-list>\n\n  <mat-accordion>\n    <mat-expansion-panel *ngFor=\"let section of sections\">\n      <mat-expansion-panel-header>\n        <mat-panel-title>\n          {{section.title}}\n        </mat-panel-title>\n        <mat-panel-description>\n          {{section.subtitle}}\n        </mat-panel-description>\n      </mat-expansion-panel-header>\n      <mat-list-item\n        *ngFor=\"let link of section.links\"\n        (click)=\"onItemClicked(link)\">\n\n        <a matLine>\n          {{ link.title }}\n        </a>\n        <mat-icon *ngIf=\"!!link.description\"\n          [matTooltip]=\"link.description || 'Description coming soon!'\">\n          info\n        </mat-icon>\n      </mat-list-item>\n      <tft-sidenav-list\n        [sections]=\"section.subsections\"\n        (itemClicked)=\"onItemClicked($event)\">\n      </tft-sidenav-list>\n    </mat-expansion-panel>\n  </mat-accordion>\n</mat-nav-list>", styles: ["mat-expansion-panel{margin:8px}::ng-deep .mat-expansion-panel-content .mat-expansion-panel-body{padding:0 0 12px}\n"] }]
        }], propDecorators: { sections: [{
                type: Input
            }], itemClicked: [{
                type: Output
            }] } });

const CORE_COMPONENTS = [
    HeaderComponent,
    SidenavListComponent,
];
class CoreModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.1", ngImport: i0, type: CoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.1", ngImport: i0, type: CoreModule, declarations: [HeaderComponent,
            SidenavListComponent], imports: [CommonModule,
            MatSidenavModule,
            MatToolbarModule,
            MatIconModule,
            MatExpansionModule,
            MatTooltipModule,
            MatListModule,
            MatButtonModule], exports: [HeaderComponent,
            SidenavListComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.1", ngImport: i0, type: CoreModule, imports: [CommonModule,
            MatSidenavModule,
            MatToolbarModule,
            MatIconModule,
            MatExpansionModule,
            MatTooltipModule,
            MatListModule,
            MatButtonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.1", ngImport: i0, type: CoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatSidenavModule,
                        MatToolbarModule,
                        MatIconModule,
                        MatExpansionModule,
                        MatTooltipModule,
                        MatListModule,
                        MatButtonModule
                    ],
                    declarations: CORE_COMPONENTS,
                    exports: CORE_COMPONENTS,
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { CoreModule, HeaderComponent, SidenavListComponent };
//# sourceMappingURL=tft-core.mjs.map
