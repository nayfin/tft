import { Directive, ElementRef, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions } from '@interactjs/types/types';
import { TftDraggable } from '../models.ts/interact';
import { Subject } from 'rxjs';


@Directive({
  selector: '[tftDraggable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {    
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',
  },
  providers: [
    InteractService,
  ]
})
export class DraggableDirective implements OnInit, OnChanges {

  DEFAULT_OPTIONS = {
    // inertia: true,
    // keep the element within the area of it's parent
    autoScroll: true,

    // call this function on every dragmove event
    onmove: (event) => {
      this.dragMoveListener(event);
    }
  }
  @Input() enableDragDefault = true;
  @Input() dragOptions: DraggableOptions;

  @Input() x: number;
  @Input() y: number;

  @Output() move = new Subject<TftDraggable>();
  constructor(
    private el: ElementRef,
    private interactService: InteractService
  ) { }

  ngOnInit() {
    interact(this.el.nativeElement).draggable({ ...this.DEFAULT_OPTIONS, ...this.dragOptions });
    this.interactService.draggable$.subscribe(draggable => this.move.next(draggable));
    this.alignPositionWithInputs()
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.x || changes.y) {
      this.alignPositionWithInputs();
    }
  }

  dragMoveListener(event) {
    event.preventDefault();
    event.stopPropagation();
    this.interactService.updateDeltas({deltaX: event.dx, deltaY: event.dy}, this.el.nativeElement);
  }

  alignPositionWithInputs() {
    console.log('aligning position', this.x, this.y)
    if(this.x && this.y) {
      this.interactService.updatePosition({x: this.x, y: this.y}, this.el.nativeElement);
    }
  }
}
