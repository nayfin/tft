import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@tft/api-interfaces';
import { interval } from 'rxjs';
import { DropzoneDirective, TftDropEvent} from '@tft/interact'
import { DraggableOptions, DropzoneOptions } from '@interactjs/types/types';
import { tap, take, switchMap, delay } from 'rxjs/operators';
import interact from 'interactjs';

@Component({
  selector: 'tft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('dropContainer2', {static: false}) dropzone2: ElementRef

  hello$ = this.http.get<Message>('/api/hello');
  
  dragSteps = 1;
  dragJumps = 500;
  dragConfig: DraggableOptions = {
    inertia: true,
  };
  dragConfigB;
  dragItems = [
    // {
    //   x: 0,
    //   y: 0,
    //   name: 'red',
    //   count: [0,1,2,3]
    // },
    {
      x: 0,
      y: 0,
      name: 'green',
      count: [0,1,2,3,4,5]
    },
    {
      x: 0,
      y: 0,
      name: 'red',
      count: [0,1,2,3]
    },
    {
      x: 0,
      y: 0,
      name: 'yellow',
      count: [0,1,2,3]
    },
  ];

  droppedItems = [];

  constructor(private http: HttpClient, private el: ElementRef) { }

  clicked() {
    console.log('clicked');
  }

  copyDrag(event, data) {
    const { positionInDropzone } = event; 
    this.dragItems.push({
      name: data.name,
      x: positionInDropzone ? positionInDropzone.x : 55,
      y: positionInDropzone ? positionInDropzone.y : 55,
      count: [0]
    })
  }
  startTest(steps: number, jumps: number) {
    this.move('right', 0, 1, steps).pipe(
      take(jumps),
      switchMap(() => this.move('left', 0, 1, steps)),
      take(jumps),
      switchMap(() => this.move('right', 0, 1, steps)),
      take(jumps)
    ).subscribe();
  }
  log(name: string, event) {
    console.log(name, event);
  }
  handleDrop(event: TftDropEvent, initialIndex) {
    console.log({dropzoneEvent: event.dragOrigin.dropzoneData})
    if (event.dropTarget && event.dropTarget !== event.dragOrigin) {
      const item = {
        x: event.positionInDropzone.x,
        y: event.positionInDropzone.y,
        name: event.dragRef.data.name
      }
      const dragData = this.dragItems[initialIndex]
      console.log({dragData, initialIndex});
      dragData.count.pop();
      this.droppedItems.push(item); 
    }
  }
  incrementX() {
    this.dragItems[0].x += 8;
  }


  move(
    direction: 'right' | 'left', 
    dragIndex: number, 
    period: number, 
    steps: number
  ) {
    return interval(period).pipe(
      tap( count => {
        const delta = direction === 'right' ? steps : -steps; 
        this.dragItems[dragIndex].x += delta;
      })
    )
  } 

  interactDragEnd(interactEvent) {
    console.log({interactEvent})
  }

}
