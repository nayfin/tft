import { Component } from '@angular/core';
import { TftGestureEvent, DragRootDirective, DropzoneDirective, AccountForScaleDirective, GesturableDirective, ResizableDirective, DraggableDirective } from '@tft/interact';

@Component({
    selector: 'tft-pinch-to-zoom',
    templateUrl: './pinch-to-zoom.component.html',
    styleUrls: ['./pinch-to-zoom.component.scss'],
    imports: [DragRootDirective, DropzoneDirective, AccountForScaleDirective, GesturableDirective, ResizableDirective, DraggableDirective]
})
export class PinchToZoomComponent {

  scale = 1;
  transformOrigin = '0 0'

  onGestureMove(event: TftGestureEvent) {
    const interactEvent = event?.interactEvent;
    this.scale += (interactEvent?.ds || 0);
  }

  // Use initial touch point as the transformOrigin so that component scales relative to users fingertips
  onGestureStart(event: TftGestureEvent) {
    const interactEvent = event?.interactEvent;
    const {x0, y0} = event.interactEvent
    this.scale += interactEvent?.ds || 0;
    this.transformOrigin = `${x0}em ${y0}em`
  }

  onGestureEnd(event: TftGestureEvent) {
    console.log('end', {scale: this.scale, event });
  }
}
