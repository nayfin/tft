import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@tft/api-interfaces';
import { DraggableOptions, DropzoneOptions } from '@interactjs/types/types';


@Component({
  selector: 'tft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  
  dragConfig: DraggableOptions = {
    inertia: true,
    allowFrom: '.handle'   
  }

  dropzoneConfig: DropzoneOptions = {
    ondropactivate: (event) => {
      // add active dropzone feedback
      event.target.classList.add('drop-active')
    },
    ondragenter: (event) => {
      const draggableElement = event.relatedTarget
      const dropzoneElement = event.target
      console.log({dragenter: event});
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
    },
    ondragleave: (event) => {
      // remove the drop feedback style
      event.target.classList.remove('drop-target')
      event.relatedTarget.classList.remove('can-drop')
      // event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: (event) => {
      console.log({dropEvent: event});
      this.droppedItems.push({x: 60, y: 80, name: 'bill'})
      // event.relatedTarget.textContent = 'Dropped'
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
    }
  }

  dragItems = [
    {
      x: 50,
      y: 600,
      name: 'red'
    },
    {
      x: 900,
      y: 50,
      name: 'green'
    }
  ];

  droppedItems = [];

  constructor(private http: HttpClient) {}

  handleMove(event) {
    console.log(event);
  }

  incrementX() {
    this.dragItems[0].x += 8;
  }

}
