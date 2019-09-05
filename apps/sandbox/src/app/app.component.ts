import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@tft/api-interfaces';
import { interval } from 'rxjs';
import { DraggableOptions, DropzoneOptions } from '@interactjs/types/types';
import { tap, take, switchMap, delay } from 'rxjs/operators';


@Component({
  selector: 'tft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  
  dragSteps = 1
  dragJumps = 500
  dragConfig: DraggableOptions = {
    inertia: true,
    allowFrom: '.handle'   
  }

  dropzoneConfig: DropzoneOptions = {
  
  }

  dragItems = [
    {
      x: 50,
      y: 0,
      name: 'red'
    },
    {
      x: 50,
      y: 50,
      name: 'green'
    }
  ];

  droppedItems = [];

  constructor(private http: HttpClient) {
    
  }

  clicked() {
    console.log('clicked');
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


}
