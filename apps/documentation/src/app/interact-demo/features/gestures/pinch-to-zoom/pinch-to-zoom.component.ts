import { Component } from '@angular/core';
import { TftGestureEvent } from '@tft/interact';

@Component({
  selector: 'tft-pinch-to-zoom',
  templateUrl: './pinch-to-zoom.component.html',
  styleUrls: ['./pinch-to-zoom.component.scss']
})
export class PinchToZoomComponent {

  scale = 1;
  angle = 0;
  transform = '';

  onGestureMove(event: TftGestureEvent) {
    const interactEvent = event?.interactEvent;

    this.scale += (interactEvent?.ds || 0);
    this.angle += (interactEvent?.da || 0);
    this.transform = `rotate(${this.angle}deg) scale(${this.scale})`;
  }

  onGestureStart(event: TftGestureEvent) {
    const interactEvent = event?.interactEvent;

    this.scale += interactEvent?.ds || 0;
    this.angle += (interactEvent?.da || 0);
    this.transform = 'scale(' + this.scale + ')';
  }

  onGestureEnd(event: TftGestureEvent) {
    console.log('end', {scale: this.scale, event });
  }
}
