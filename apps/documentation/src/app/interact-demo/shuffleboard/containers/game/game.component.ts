import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TftDropEvent, DragRootDirective, DropzoneDirective } from '@tft/interact';
import { initialGameState } from './consts';
import { Team } from '../../models/shuffleboard.model'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScoreboardComponent } from '../../components/scoreboard/scoreboard.component';
import { BoardComponent } from '../../components/board/board.component';
import { PuckComponent } from '../../components/puck/puck.component';
import { PlayerZoneComponent } from '../../components/player-zone/player-zone.component';
import { TrayComponent } from '../../components/tray/tray.component';
import { TargetZoneComponent } from '../../components/target-zone/target-zone.component';
import { TargetComponent } from '../../components/target/target.component';
import { JsonPipe, KeyValuePipe } from '@angular/common';
// import { RestrictOptions } from '@interactjs/modifiers/restrict/pointer';

@Component({
    selector: 'tft-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    imports: [ScoreboardComponent, ReactiveFormsModule, BoardComponent, DragRootDirective, PuckComponent, PlayerZoneComponent, DropzoneDirective, TrayComponent, TargetZoneComponent, TargetComponent, JsonPipe, KeyValuePipe]
})
export class GameComponent {
  moves = 0;
  team = Team;
  readonly whosTurn = signal<Team>(Team.RED);
  readonly turnCount = signal(0);
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
  inertiaResistanceControl = new FormControl(2);
  readonly resistance = toSignal(this.inertiaResistanceControl.valueChanges, { initialValue: this.inertiaResistanceControl.value });

  checkForFoul(event) {
    console.log({foul: event})
  }

  updateLocation(event: TftDropEvent, key: string) {
    const team = event.dragRef.dragData().team;
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
    const { team, key} = event.dragRef.dragData();
    this.updateLocation(event, key);
    this.changeTeams(team);
    if ( team === Team.BLUE ) {
      this.turnCount.update((count) => count + 1);
    }
  }

  resetBoard() {
    this.resetPucks();
    this.targets.forEach(target => target.pucksInTarget = 0);
    this.turnCount.set(0);
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
    const points = event.dropTarget.dropzoneData().points;
    const team = event.dragRef.dragData().team;
    this.game[team].score += points;
    this.handleDrop(event);
  }

  changeTeams(currentTeam: Team) {
    this.whosTurn.set(currentTeam === Team.BLUE ? Team.RED : Team.BLUE);
  }

}
