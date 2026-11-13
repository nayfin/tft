import { Component, OnInit, ChangeDetectionStrategy, input, output } from '@angular/core';
import { TftDragEvent, TftDropEvent, DropzoneDirective } from '@tft/interact';
import { Team } from '../../models/shuffleboard.model';
import { DropzoneOptions } from '@interactjs/types/index';
import { NgClass } from '@angular/common';

@Component({
    selector: 'tft-target',
    templateUrl: './target.component.html',
    styleUrls: ['./target.component.scss'],
    imports: [DropzoneDirective, NgClass]
})
export class TargetComponent implements OnInit {
  readonly value = input(10);
  readonly pucksInTarget = input(0);
  readonly scorePoints = output<TftDropEvent>();
  readonly puckEnter = output<void>();
  readonly puckLeave = output<void>();

  dropzoneConfig: DropzoneOptions = {
    overlap: 0.5
  }
  constructor() { }

  ngOnInit() {
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
