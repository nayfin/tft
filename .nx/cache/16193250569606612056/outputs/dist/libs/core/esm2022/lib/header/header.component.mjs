import { Component, Output, Input, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/toolbar";
import * as i2 from "@angular/material/icon";
import * as i3 from "@angular/material/button";
export class HeaderComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvY29yZS9zcmMvbGliL2hlYWRlci9oZWFkZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9jb3JlL3NyYy9saWIvaGVhZGVyL2hlYWRlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQVEvRSxNQUFNLE9BQU8sZUFBZTtJQU8xQjtRQUxVLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUV4QyxVQUFLLEdBQUcsb0JBQW9CLENBQUM7SUFHdEIsQ0FBQztJQUVqQixRQUFRO0lBQ1IsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7OEdBZFUsZUFBZTtrR0FBZixlQUFlLDZJQ1I1QixxTkFPQTs7MkZEQ2EsZUFBZTtrQkFMM0IsU0FBUzsrQkFDRSxZQUFZOzBFQU1aLFdBQVc7c0JBQXBCLE1BQU07Z0JBRUUsS0FBSztzQkFBYixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgT3V0cHV0LCBJbnB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndGZ0LWhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9oZWFkZXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBIZWFkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBPdXRwdXQoKSBtZW51Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBASW5wdXQoKSB0aXRsZSA9ICdUb3J0aWxsYSBGbGF0IFRlY2gnO1xuICBASW5wdXQoKSBzdWJ0aXRsZTtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgb25NZW51Q2xpY2tlZCgpIHtcbiAgICB0aGlzLm1lbnVDbGlja2VkLmVtaXQoKTtcbiAgfVxufVxuIiwiPG1hdC10b29sYmFyPlxuICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwib25NZW51Q2xpY2tlZCgpXCI+XG4gICAgPG1hdC1pY29uPm1lbnU8L21hdC1pY29uPlxuICA8L2J1dHRvbj5cbiAgPHN0cm9uZz57eyB0aXRsZSB9fSA8L3N0cm9uZz48c3BhbiBjbGFzcz1cInN1Yi10aXRsZVwiPnt7c3VidGl0bGV9fTwvc3Bhbj5cblxuPC9tYXQtdG9vbGJhcj5cbiJdfQ==