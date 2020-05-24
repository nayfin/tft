import { Component, Renderer2, ViewChild } from '@angular/core';
import { TftDropEvent, DropzoneDirective } from '@tft/interact';
import { DraggableOptions } from '@interactjs/types';

@Component({
  selector: 'tft-yard',
  templateUrl: './yard.component.html',
  styleUrls: ['./yard.component.scss']
})
export class YardComponent {

  @ViewChild(DropzoneDirective) dropzone2: DropzoneDirective;

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
    private renderer: Renderer2
  ) { }

  handleDrop(event: TftDropEvent, initialIndex) {
    const dragData = this.dragItems[initialIndex];
    const {dragRef, dropTarget} = event;

    if (dropTarget && dropTarget.dropzoneId === 'yard') {
      const item = {
        x: event.positionInDropTarget.x,
        y: event.positionInDropTarget.y,
        name: event.dragRef.dragData.name
      }
      dragData.count--;
      this.droppedItems.push(item);
    } else {
      this.renderer.setStyle(
        event.interactEvent.target,
        'transition',
        'transform 500ms ease-in-out'
      )
      setTimeout(() => {
        this.renderer.removeStyle(
          event.interactEvent.target,
          'transition'
        )
      }, 500)
    }
    dragRef.setPosition(0, 0);
  }


}
