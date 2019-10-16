import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  @ViewChild('dropContainer2', {static: false}) dropzone2: ElementRef

  dragConfig: DraggableOptions; 
  dragConfigB: DraggableOptions;
  dragItems = [
    {
      name: 'green',
      count: Infinity
    },
    {
      name: 'red',
      count: 3
    },
    {
      name: 'yellow',
      count: 5
    },
  ];

  droppedItems = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  log(name: string, event) {
    console.log(name, event);
  }

  countAsArray(n: number) : number[] {
    const count = n === Infinity ? 2 : n;
    console.log({count})
    return [...Array(count).keys()];
  }

  handleDrop(event: TftDropEvent, initialIndex) {
    const dragData = this.dragItems[initialIndex];
    if (event.dropTarget && event.dropTarget !== event.dragOrigin) {
      const item = {
        x: event.positionInDropzone.x,
        y: event.positionInDropzone.y,
        name: event.dragRef.dragData.name
      }
      dragData.count--;
      this.droppedItems.push(item); 
    } else {
      const {dragRef} = event;
      this.renderer.setStyle(
        event.event.target,
        'transition',
        'transform 500ms ease-in-out'
      )
      dragRef.setPosition(0, 0);
      setTimeout(() => {
        this.renderer.removeStyle(
          event.event.target,
          'transition'
        )
      }, 500)
    }
  }


}
