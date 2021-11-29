import { Component, Renderer2 } from '@angular/core';
import { TftDropEvent } from '@tft/interact';
import { DraggableOptions } from '@interactjs/types';

interface DroppedItem {
  name: string;
  x: number;
  y: number;
}

@Component({
  selector: 'tft-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {
  droppedItems: DroppedItem[] = [];
  dragConfig: DraggableOptions = {};

  constructor(
    private renderer: Renderer2
  ) { }


  handleDrop(event: TftDropEvent) {
    const {dragRef, dropTarget} = event;
    const dragData = dragRef.dragData || { count: 0, name: 'No name'};
    if (dropTarget?.dropzoneId === 'yard' && dropTarget !== dragRef.dropzone_dir) {
      const item = {
        x: event.positionInDropTarget.x,
        y: event.positionInDropTarget.y,
        name: dragRef.dragData?.name
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
}
