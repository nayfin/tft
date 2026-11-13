import { Component, OnInit, ChangeDetectionStrategy, SimpleChanges, OnChanges, computed, input, output } from '@angular/core';
import { Team, Puck } from '../../models/shuffleboard.model';
import { DraggableOptions } from '@interactjs/types/index';
import interact from 'interactjs';
import { TftDragEvent, DraggableDirective } from '@tft/interact';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'tft-puck',
    templateUrl: './puck.component.html',
    styleUrls: ['./puck.component.scss'],
    imports: [DraggableDirective, NgClass, NgStyle]
})
export class PuckComponent implements OnInit, OnChanges {
  readonly whosTurn = input<Team>(undefined);
  readonly turnCount = input<number>(undefined);
  readonly index = input<number>(undefined);
  readonly team = input<Team>(undefined);
  readonly puck = input<Puck>(undefined);
  readonly key = input<string>(undefined);
  /** When set, replaces the default inertia options with `{ resistance }`. */
  readonly resistance = input<number>();
  readonly puckDrop = output<TftDragEvent>();

  teamClass: string;
  // restrictOptions: RestrictOptions;
  private readonly baseDragConfig: DraggableOptions = {
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

  readonly dragConfig = computed<DraggableOptions>(() => {
    const resistance = this.resistance();
    return resistance === undefined
      ? this.baseDragConfig
      : { ...this.baseDragConfig, inertia: { resistance } };
  });

  constructor() { }

  ngOnInit() {
    this.teamClass = this.team().toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if( changes.whosTurn || changes.turnCount) {
    //   const enabled = (this.whosTurn === this.team && this.turnCount === this.index)
    //   this.dragConfig = {
    //     ...this.dragConfig,
    //     enabled
    //   }
    // }
  }
}
