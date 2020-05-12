import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TftDropEvent } from '@tft/interact';
import { Team } from '../../models/shuffleboard.model';
import { DropzoneOptions } from '@interactjs/types';

@Component({
  selector: 'tft-target-zone',
  templateUrl: './target-zone.component.html',
  styleUrls: ['./target-zone.component.scss']
})
export class TargetZoneComponent implements OnInit {
  @Output() turnOver = new EventEmitter<TftDropEvent>();

  constructor() { }

  ngOnInit() {
  }

  onDragDrop(event: TftDropEvent) {
    this.turnOver.emit(event);
  }


  onDragEnter(event: TftDropEvent) {
    console.log('dragEnter', event);
  }

}
