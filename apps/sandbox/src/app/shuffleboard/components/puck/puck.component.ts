import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Team, Puck } from '../../models/shuffleboard.model';
import { DraggableOptions } from '@interactjs/types/types';
import interact from 'interactjs';
import { TftDragEvent } from '@tft/interact';

@Component({
  selector: 'tft-puck',
  templateUrl: './puck.component.html',
  styleUrls: ['./puck.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuckComponent implements OnInit, OnChanges {
  @Input() whosTurn: Team;
  @Input() turnCount: number;
  @Input() index: number;
  @Input() team: Team;
  @Input() puck: Puck;
  @Input() key: string;
  _resistance = 2;
  @Input() set resistance(val: number){
    this._resistance = val;
    this.dragConfig = {...this.dragConfig, ...{inertia: {resistance: val}}}
    // this.dragConfig.inertia.resistance = val;
  };
  get resistance() {
    return this._resistance;
  }
  @Output() puckDrop = new EventEmitter<TftDragEvent>();

  teamClass: string;
  // restrictOptions: RestrictOptions;
  dragConfig: DraggableOptions = {
    inertia: {
      resistance: 1,
      allowResume: true,
      endSpeed: 10,
      smoothEndDuration: 2000 
    },
    modifiers: [
      interact.modifiers.restrict({
        restriction: 'tft-board',
        endOnly: false,   
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      })
    ]
  }
  constructor() { }

  ngOnInit() {
    this.teamClass = this.team.toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges) {
    if( changes.whosTurn || changes.turnCount) {
      const enabled = (this.whosTurn === this.team && this.turnCount === this.index)
      this.dragConfig = {
        ...this.dragConfig, 
        enabled
      }
    }
  }
}
