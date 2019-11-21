import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TftDragEvent, TftDropEvent } from '@tft/interact';
import { initialGameState } from './consts';
import { Team } from '../../models/shuffleboard.model'
import { TargetComponent } from '../../components/target/target.component';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
// import { RestrictOptions } from '@interactjs/modifiers/restrict/pointer';

@Component({
  selector: 'tft-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  moves = 0;
  team = Team;
  whosTurn: Team = Team.RED;
  turnCount = 0;
  game = initialGameState;

  get allPucks() {
    return {
      ...this.game.BLUE.pucks, 
      ...this.game.RED.pucks
    };
  }

  targets = [
    { 
      value: 10,
      pucksInTarget: 0
    }, { 
      value: 20,
      pucksInTarget: 0
    }, { 
      value: 30,
      pucksInTarget: 0
    },
  ];
  resistance = 2;
  inertiaResistanceControl = new FormControl(this.resistance);
  ircSubscription: Subscription;
  constructor(
    // private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.ircSubscription = this.inertiaResistanceControl.valueChanges
      .subscribe(resistance => this.resistance = resistance)
  }

  checkForFoul(event) {
    console.log({foul: event})
  }

  updateLocation(event: TftDropEvent, key: string) {
    const team = event.dragRef.dragData.team;
    this.game[team].pucks[key].location.x = event.dragRef.x;
    this.game[team].pucks[key].location.y = event.dragRef.y;
  }

  updateTargetState(index:number, state: 'enter' | 'leave') {
    if (state === 'leave') {
      this.targets[index].pucksInTarget--;
      return
    }
    this.targets[index].pucksInTarget++;
  }
  handleDrop(event: TftDropEvent) {
    const { team, key} = event.dragRef.dragData;
    this.updateLocation(event, key);
    this.changeTeams(team);
    console.log('handleDrop', event)
    if ( team === Team.BLUE ) { 
      this.turnCount++; 
    }
  }

  resetBoard() {
    this.resetPucks();
    this.targets.forEach(target => target.pucksInTarget = 0);
    this.turnCount = 0;
  }

  resetTeamPucks(team: Team) {
    const pucks = this.game[team].pucks;
    Object.keys(pucks).forEach(key => {
      const { x, y } = pucks[key].startLocation;
      pucks[key].location.x = x;
      pucks[key].location.y = y;
    });
  }

  resetPucks() {
    this.resetTeamPucks(Team.RED);
    this.resetTeamPucks(Team.BLUE);
  }

  handleScore(event: TftDropEvent) {
    const points = event.dropTarget.dropzoneData.points;
    const team = event.dragRef.dragData.team;
    this.game[team].score += points;
    this.handleDrop(event);
  }

  changeTeams(currentTeam: Team) {
    this.whosTurn = currentTeam === Team.BLUE ? Team.RED : Team.BLUE;
  }

  log(name: string, event) {
    console.log(name, event);
  }

}
