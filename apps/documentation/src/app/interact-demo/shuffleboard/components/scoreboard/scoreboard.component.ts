import { Component, input } from '@angular/core';

@Component({
    selector: 'tft-scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent {
  readonly redScore = input<number>(undefined);
  readonly blueScore = input<number>(undefined);
}
