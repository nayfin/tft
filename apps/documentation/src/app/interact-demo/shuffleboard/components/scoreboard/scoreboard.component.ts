import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tft-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  @Input() redScore: number;
  @Input() blueScore: number;

  constructor() { }

  ngOnInit() {
  }

}
