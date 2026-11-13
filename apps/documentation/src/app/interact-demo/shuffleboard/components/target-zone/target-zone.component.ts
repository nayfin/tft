import { Component, OnInit, output } from '@angular/core';
import { TftDropEvent, DropzoneDirective } from '@tft/interact';
import { Team } from '../../models/shuffleboard.model';
import { DropzoneOptions } from '@interactjs/types/index';

@Component({
    selector: 'tft-target-zone',
    templateUrl: './target-zone.component.html',
    styleUrls: ['./target-zone.component.scss'],
    imports: [DropzoneDirective]
})
export class TargetZoneComponent implements OnInit {
  readonly turnOver = output<TftDropEvent>();

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
