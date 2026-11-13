import { Component, OnInit, input } from '@angular/core';

@Component({
    selector: 'tft-scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  readonly redScore = input<number>(undefined);
  readonly blueScore = input<number>(undefined);

  constructor() { }

  ngOnInit() {
  }

}
