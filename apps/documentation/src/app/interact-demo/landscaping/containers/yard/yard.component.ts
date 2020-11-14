import { Component, Renderer2, ViewChild } from '@angular/core';
import { TftDropEvent, DropzoneDirective } from '@tft/interact';
import { DraggableOptions } from '@interactjs/types/index';

interface InventoryItem {
  name: string;
  count: number;
}

interface DroppedItem {
  name: string;
  x: number;
  y: number;
}
@Component({
  selector: 'tft-yard',
  templateUrl: './yard.component.html',
  styleUrls: ['./yard.component.scss']
})
export class YardComponent {

  @ViewChild(DropzoneDirective) dropzone2: DropzoneDirective;

  dragConfig: DraggableOptions = {allowFrom: '.handle'};
  dragConfigB: DraggableOptions;

  dragInventory: InventoryItem[] = [
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
    {
      name: 'blue',
      count: 3
    },
    {
      name: 'orange',
      count: 5
    },
    {
      name: 'pink',
      count: 3
    },
    {
      name: 'purple',
      count: 5
    },
  ];

  droppedItems: DroppedItem[] = [];

  constructor(
    private renderer: Renderer2
  ) { }


  handleDrop(event: TftDropEvent) {
    const {dragRef, dropTarget} = event;
    const dragData = dragRef.dragData;
    if (dropTarget?.dropzoneId === 'yard' && dropTarget !== dragRef.dropzone_dir) {
      const item = {
        x: event.positionInDropTarget.x,
        y: event.positionInDropTarget.y,
        name: dragRef.dragData.name
      }
      dragData.count--;
      this.droppedItems.push(item);
    } else {
      this.renderer.setStyle(
        dragRef.el.nativeElement,
        'transition',
        'transform 500ms ease-in-out'
      )
      setTimeout(() => {
        this.renderer.removeStyle(
          dragRef.el.nativeElement,
          'transition'
        )
      }, 500)
    }
    dragRef.setPosition(0, 0);
  }

  log(type:string, event: any) {
    console.log(type, event);
  }
}
