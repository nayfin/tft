import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TftDragEvent, TftDropEvent } from '@tft/interact';
import { Team } from '../../models/shuffleboard.model';

@Component({
  selector: 'tft-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetComponent implements OnInit {
  @Input() value = 10;
  @Input() pucksInTarget = 0;
  @Output() scorePoints: EventEmitter<TftDropEvent> = new EventEmitter();
  @Output() puckEnter = new EventEmitter<void>();
  @Output() puckLeave = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  score(event: TftDropEvent) {
    this.scorePoints.emit(event);
  }


  puckEnterTarget(event: TftDropEvent) {
    if(event.dragRef.disabled) return;
    this.puckEnter.emit();
  }

  puckLeaveTarget() {
    this.puckLeave.emit();
  }
}
