import { Component, output } from '@angular/core';
import { TftDropEvent, DropzoneDirective } from '@tft/interact';

@Component({
    selector: 'tft-target-zone',
    templateUrl: './target-zone.component.html',
    styleUrls: ['./target-zone.component.scss'],
    imports: [DropzoneDirective]
})
export class TargetZoneComponent {
  readonly turnOver = output<TftDropEvent>();

  onDragDrop(event: TftDropEvent) {
    this.turnOver.emit(event);
  }

  onDragEnter(event: TftDropEvent) {
    console.log('dragEnter', event);
  }
}
