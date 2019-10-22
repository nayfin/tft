import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tft-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetComponent implements OnInit {
  @Input() value = 10;
  @Output() scorePoints: EventEmitter<number> = new EventEmitter<number>();

  highlighted = false
  constructor() { }

  ngOnInit() {
  }

  score(points: number) {
    console.log({points})
    this.scorePoints.emit(points);
  }

  toggleHighlight(highlight: boolean) {
    this.highlighted = highlight;
  }

}
