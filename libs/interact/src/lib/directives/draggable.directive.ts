import { Directive, ElementRef, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions } from '@interactjs/types/types';
import { TftDraggable } from '../models.ts/draggable';
import { Subject } from 'rxjs';


@Directive({
  selector: '[tftDraggable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {    
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',
  },
  providers: [InteractService]
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
    this.interactService.position$.subscribe(position => this.move.next(position));
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
    this.interactService.updateDeltas({x: event.dx, y: event.dy}, this.el.nativeElement);
  }

  alignPositionWithInputs() {
    console.log('aligning position', this.x, this.y)
    if(this.x && this.y) {
      this.interactService.updatePosition({x: this.x, y: this.y}, this.el.nativeElement);
    }
  }
}
