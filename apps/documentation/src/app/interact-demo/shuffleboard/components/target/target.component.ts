import { Component, input, output } from '@angular/core';
import { TftDropEvent, DropzoneDirective } from '@tft/interact';
import { DropzoneOptions } from '@interactjs/types/index';
import { NgClass } from '@angular/common';

@Component({
    selector: 'tft-target',
    templateUrl: './target.component.html',
    styleUrls: ['./target.component.scss'],
    imports: [DropzoneDirective, NgClass]
})
export class TargetComponent {
  readonly value = input(10);
  readonly pucksInTarget = input(0);
  readonly scorePoints = output<TftDropEvent>();
  readonly puckEnter = output<void>();
  readonly puckLeave = output<void>();

  dropzoneConfig: DropzoneOptions = {
    overlap: 0.5
  }

  score(event: TftDropEvent) {
    this.scorePoints.emit(event);
  }

  onChange(event) {
    this.dropzoneConfig = {...this.dropzoneConfig, overlap:  +event.target.value}
  }

  puckEnterTarget(event: TftDropEvent) {
    if(event.dragRef.disabled) return;
    this.puckEnter.emit();
  }

  puckLeaveTarget() {
    this.puckLeave.emit();
  }
}
