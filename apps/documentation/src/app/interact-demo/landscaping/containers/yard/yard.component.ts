import { Component } from '@angular/core';
import { TftGestureEvent, TftResizeEvent } from '@tft/interact';



@Component({
  selector: 'tft-yard',
  templateUrl: './yard.component.html',
  styleUrls: ['./yard.component.scss']
})
export class YardComponent {

  // @ViewChild(DropzoneDirective) dropzone2: DropzoneDirective;

  dropZoneWidth = 200;
  dropZoneHeight = 300;
  disableBlueBox = false

  scale = 1;

  log(type:string, event: any) {
    console.log(type, event);
  }
  updateSize(event: TftResizeEvent) {
    this.dropZoneHeight = event.size.height;
    this.dropZoneWidth = event.size.width;
  }

  onGestureMove(event: TftGestureEvent) {
    const interactEvent = event?.interactEvent;
    this.scale += (interactEvent?.ds || 0);
  }

  // Use initial touch point as the transformOrigin so that component scales relative to users fingertips
  onGestureStart(event: TftGestureEvent) {
    const interactEvent = event?.interactEvent;
    this.scale += interactEvent?.ds || 0;
  }

  onGestureEnd(event: TftGestureEvent) {
    console.log('end', {scale: this.scale, event });
  }
}
