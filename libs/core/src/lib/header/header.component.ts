import { Component, OnInit, input, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'tft-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [MatToolbar, MatIconButton, MatIcon]
})
export class HeaderComponent implements OnInit {

  readonly menuClicked = output<void>();

  readonly title = input('Tortilla Flat Tech');
  readonly subtitle = input<string>();

  constructor() { }

  ngOnInit() {
  }

  onMenuClicked() {
    this.menuClicked.emit();
  }
}
