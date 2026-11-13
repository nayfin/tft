import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
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

  @Output() menuClicked = new EventEmitter<void>();

  @Input() title = 'Tortilla Flat Tech';
  @Input() subtitle;

  constructor() { }

  ngOnInit() {
  }

  onMenuClicked() {
    this.menuClicked.emit();
  }
}
