import { Component, OnInit, ElementRef } from '@angular/core';
import { DraggableOptions } from '@interactjs/types/types';
import interact from 'interactjs';
import { TftDragEvent } from '@tft/interact';
import { Player, Team } from '../../models/shuffleboard.model'
import { RestrictOptions } from '@interactjs/modifiers/restrict/pointer';

@Component({
  selector: 'tft-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  moves = 0;

  players: {[key in Team]: Player} = {
    'RED': {
      score: 0
    },
    'BLUE': {
      score: 0
    }
  };

  targets = [
    { value: 10},
    { value: 20},
    { value: 30},
  ]
  restrictOptions: RestrictOptions;
  puckDragConfig: DraggableOptions = {
    inertia: {
      resistance: .9,
      allowResume: true,
    },
    modifiers: [
      interact.modifiers.restrict({
        restriction: 'parent',
        endOnly: false,    
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      })
    ]
  }

  constructor() { }

  ngOnInit() {
  }

  handleScore(points: number) {
    console.log('scoring', points);
    this.players.RED.score += points;
  }

  highlightTarget(index: number, el: ElementRef) {
    console.log({index, el});
  }

  drag(event: TftDragEvent) {
    const {dx, dy} = event.interactEvent;
    this.moves++;
    // console.log('drag', event, { moves: this.moves, dx, dy})
  }
  log(name: string, event) {
    console.log(name, event);
  }

}
