import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { ShuffleboardRoutingModule } from './shuffleboard-routing.module';
import { GameComponent } from './containers/game/game.component';
import { BoardComponent } from './components/board/board.component';
import { PlayerZoneComponent } from './components/player-zone/player-zone.component';
import { TargetComponent } from './components/target/target.component';
import { TrayComponent } from './components/tray/tray.component';
import { PuckComponent } from './components/puck/puck.component';
import { InteractModule } from '@tft/interact';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { TargetZoneComponent } from './components/target-zone/target-zone.component';


@NgModule({
  declarations: [
    GameComponent,
    BoardComponent,
    PlayerZoneComponent,
    TargetComponent,
    TrayComponent,
    PuckComponent,
    ScoreboardComponent,
    TargetZoneComponent
  ],
  imports: [
    CommonModule,
    ShuffleboardRoutingModule,
    InteractModule,
    ReactiveFormsModule
  ]
})
export class ShuffleboardModule { }
