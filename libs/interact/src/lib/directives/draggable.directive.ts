import { Directive, ElementRef, Input, OnInit, Output, OnChanges, SimpleChanges, OnDestroy, EventEmitter, Optional, SkipSelf } from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions } from '@interactjs/types/types';
import { Subscription } from 'rxjs';
import { DragEvent } from '@interactjs/actions';
import { DropzoneDirective } from './dropzone.directive';


@Directive({
  selector: '[tftDraggable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {    
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',
    '[id]': 'interactableId',
  }
})
export class DraggableDirective implements OnInit, OnChanges, OnDestroy {

  DEFAULT_CONFIG: Partial<Interact.OrBoolean<DraggableOptions>> = {
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
    onstart: (event: DragEvent) => this.dragStart.emit(event),
    oninertiastart: (event: DragEvent) => this.dragInertiaStart.emit(event),
    onend: (event: DragEvent) => this.dragEnd.emit(event),
  }

  @Input() enableDragDefault = true;
  @Input() dragOptions: Partial<Interact.OrBoolean<DraggableOptions>>;
  @Input() x: number;
  @Input() y: number;
  // pipes all interact events to event emitters 
  @Output() dragMove = new EventEmitter<DragEvent>();
  @Output() dragStart = new EventEmitter<DragEvent>();
  @Output() dragEnd = new EventEmitter<DragEvent>();
  @Output() dragInertiaStart = new EventEmitter<DragEvent>();
  
  interactableId: string;
  registryId: string;

  interactableSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private interactService: InteractService,
    @Optional() @SkipSelf() private dropzone_dir?: DropzoneDirective

  ) { }

  ngOnInit() {
    
    this.interactService.checkForOverridesInConfig(this.dragOptions, ['onstart', 'onmove', 'onend', 'oninertiastart'])
    interact(this.el.nativeElement).draggable({ ...this.DEFAULT_CONFIG, ...this.dragOptions });

    this.registryId = this.dropzone_dir && this.dropzone_dir.dropzoneId
      ? this.dropzone_dir.dropzoneId
      : 'default';
      
    this.interactableId = this.interactService.addDraggableToRegistry(this.registryId);
   
    this.interactableSubscription = this.interactService.getInteractable(this.interactableId, this.registryId).subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.x || changes.y) {
      this.alignPositionWithInputs();
    }
  }

  ngOnDestroy() {
    this.interactableSubscription.unsubscribe();
    this.interactService.destroyInteractable(this.interactableId, this.registryId);
  }

  dragMoveListener(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.interactService.updateDeltas(this.interactableId, this.registryId, {deltaX: event.dx, deltaY: event.dy}, this.el.nativeElement);
  }

  alignPositionWithInputs() {
    if(this.isValidPosition(this.x, this.y)) {
      this.interactService.updatePosition(this.interactableId, this.registryId, {x: this.x, y: this.y}, this.el.nativeElement);
    }
  }

  isValidPosition(x: number, y: number) {
    return this.isNumeric(x) && this.isNumeric(y);
  }
  // We use use this instead of isNaN here to try and help performance
  // We should be able to reliably restrict to numbers or falsey values
  isNumeric(num: number) {
    return typeof num === 'number' && num !== NaN;
  }
}
