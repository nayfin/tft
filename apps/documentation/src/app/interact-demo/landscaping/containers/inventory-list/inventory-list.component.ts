import { Component } from '@angular/core';
import { DraggableOptions } from '@interactjs/types';

interface InventoryItem {
  name: string;
  count: number;
}

@Component({
  selector: 'tft-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent {

  dragConfig: DraggableOptions = {allowFrom: '.handle'};

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

}
