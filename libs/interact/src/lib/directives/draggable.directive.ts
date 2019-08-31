import { Directive, ElementRef, Input, OnInit, Output, OnChanges, SimpleChanges, OnDestroy, EventEmitter } from '@angular/core';
import interact from 'interactjs';
import { InteractService, InteractableSystem } from '../services/interact.service';
import { DraggableOptions } from '@interactjs/types/types';
import { TftDraggable } from '../models.ts/interact';
import { Subject, Subscription } from 'rxjs';
import { DragEvent } from '@interactjs/actions';


@Directive({
  selector: '[tftDraggable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {    
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',
  }
})
export class DraggableDirective implements OnInit, OnChanges, OnDestroy {

  draggableId: string;

  DEFAULT_OPTIONS: Partial<Interact.OrBoolean<DraggableOptions>> = {
    // inertia: true,
    // keep the element within the area of it's parent
    autoScroll: true,
    // call this function on every dragmove event
    onmove: (event: DragEvent) => {
      if (this.enableDragDefault) {
        this.dragMoveListener(event);
      }
      this.dragMove.emit(event);
    },
    onstart: (event: DragEvent) => {
      this.dragStart.emit(event);
    },
    onend: (event: DragEvent) => {
      this.dragEnd.emit(event);
    },
    oninertiastart: (event: DragEvent) => {
      this.inertiaStart.emit(event);
    },
  }

  @Input() enableDragDefault = true;
  @Input() dragOptions: Partial<Interact.OrBoolean<DraggableOptions>>;
  @Input() x: number;
  @Input() y: number;
  @Input() interactableId: string;
  // pipes all interact events to event emitters 
  @Output() dragMove = new EventEmitter<DragEvent>();
  @Output() dragStart = new EventEmitter<DragEvent>();
  @Output() dragEnd = new EventEmitter<DragEvent>();
  @Output() inertiaStart = new EventEmitter<DragEvent>();

  // interactableSystem: InteractableSystem
  interactableSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private interactService: InteractService
  ) { }

  ngOnInit() {
    
    interact(this.el.nativeElement).draggable({ ...this.DEFAULT_OPTIONS, ...this.dragOptions });

    this.interactableId = this.interactService.addDraggableToRegistry();
    this.interactableSubscription = this.interactService.dragRegistry[this.interactableId].draggable$.subscribe();
    this.alignPositionWithInputs()
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.x || changes.y) {
      this.alignPositionWithInputs();
    }
  }

  ngOnDestroy() {
    this.interactableSubscription.unsubscribe();
  }

  dragMoveListener(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.interactService.updateDeltas(this.interactableId, {deltaX: event.dx, deltaY: event.dy}, this.el.nativeElement);
  }

  alignPositionWithInputs() {
    if(this.x && this.y) {
      this.interactService.updatePosition(this.interactableId, {x: this.x, y: this.y}, this.el.nativeElement);
    }
  }
}
