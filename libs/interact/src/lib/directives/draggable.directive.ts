import { Directive, ElementRef, Input, OnInit, Output, OnChanges, SimpleChanges, OnDestroy, EventEmitter, Optional, SkipSelf, Renderer2 } from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions } from '@interactjs/types/types';
import { Subscription } from 'rxjs';
import { DragEvent } from '@interactjs/actions';
import { DropzoneDirective } from './dropzone.directive';
import { NgDragEvent, TftDragEvent } from '../models';

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
    autoScroll: true,
    onstart: (event: NgDragEvent) => {
      this.dragStart.emit(this.mapDragEvent(event));
    },
    onmove: (event: NgDragEvent) => {
      if (this.enableDragDefault) {
        this.dragMoveListener(event);
      }
      this.dragMove.emit(this.mapDragEvent(event));
    },
    oninertiastart: (event: NgDragEvent) => {
      this.dragInertiaStart.emit(this.mapDragEvent(event))
    },
    onend: (event: NgDragEvent) => {
      this.dragEnd.emit(this.mapDragEvent(event))
    },  
  }

  @Input() dragData: any;
  @Input() enableDragDefault = true;
  @Input() dragConfig: Partial<Interact.OrBoolean<DraggableOptions>>;
  @Input() x: number;
  @Input() y: number;
  // pipes all interact events to event emitters 
  @Output() dragStart = new EventEmitter<TftDragEvent>();
  @Output() dragMove = new EventEmitter<TftDragEvent>();
  @Output() dragInertiaStart = new EventEmitter<TftDragEvent>();
  @Output() dragEnd = new EventEmitter<TftDragEvent>();
  
  interactableId: string;
  registryId: string;

  interactableSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private interactService: InteractService,
    private renderer: Renderer2,
    @Optional() @SkipSelf() public dropzone_dir?: DropzoneDirective
  ) { }

  ngOnInit() {
    
    this.interactService.checkForOverridesInConfig(this.dragConfig, ['onstart', 'onmove', 'onend', 'oninertiastart'])
    interact(this.el.nativeElement).draggable({ ...this.DEFAULT_CONFIG, ...this.dragConfig });
    // Set our target and origin to the parent zone, since we're starting here
    this.el.nativeElement.dropTarget = this.el.nativeElement.dragOrigin = this.dropzone_dir || null;
    // register with parent dropzone if it exists, otherwise use default
    this.registryId = this.dropzone_dir && this.dropzone_dir.dropzoneId
      ? this.dropzone_dir.dropzoneId
      : 'default';
    // add draggable to directory and store its id 
    this.interactableId = this.interactService.addDraggableToRegistry(this.registryId);
   
    this.interactableSubscription = this.interactService.getInteractable(this.interactableId, this.registryId).subscribe();
    
    // this.el.nativeElement.data = this.data;
    this.renderer.setProperty(this.el.nativeElement, 'dragRef', this);
    // this.renderer.setProperty(this.el.nativeElement, 'dragData', this.dragData);
    this.alignPositionWithInputs()
  };

  ngOnChanges(changes: SimpleChanges) {
    if(changes.x || changes.y) {
      this.alignPositionWithInputs();
    }
  }

  ngOnDestroy() {
    this.interactableSubscription.unsubscribe();
    this.interactService.destroyInteractable(this.interactableId, this.registryId);
  }

  dragMoveListener(event: NgDragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.interactService.updateDeltas(this.interactableId, this.registryId, {deltaX: event.dx, deltaY: event.dy}, this.el.nativeElement);
  }

  mapDragEvent(event: NgDragEvent): TftDragEvent {
    const { target } = event;
    const relatedTarget = target.dropTarget 
      ? target.dropTarget.el.nativeElement 
      : null;
    const positionInDropzone = target && relatedTarget
      ? this.interactService.calculatePositionInDropzone(relatedTarget, target)
      : null;
    return {
      event: event,
      // TODO: getting set and getting data from the target element is not ideal way to transfer data
      // find an Angulary way to do this
      dragRef: this, //target.dragRef,
      dragOrigin: target.dragOrigin,
      dropTarget: target.dropTarget,
      positionInDropzone
    }

  }
  
  setPosition(x: number, y: number) {
    this.interactService.updatePosition(
      this.interactableId,
      this.registryId,
      {x, y},
      this.el.nativeElement
    );
  }
  cloneElement(element: HTMLElement) {
    const elementRect = element.getBoundingClientRect()
    const clone = element.cloneNode(true) as HTMLElement;
    element.style.transform = this.interactService.createTransformString(elementRect.left, elementRect.top);
    const interactId = this.interactService.addDraggableToRegistry();
    // clone.draggable = true;
    this.interactService.updatePosition(interactId, 'default', {x:40, y: 90}, clone);
    clone.removeAttribute('id');
    clone.style.width = '150px';
    clone.style.height = '150px';

    return clone;
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


/**
 * Component utils
 */

function getPreviewInsertionPoint(documentRef: any): HTMLElement {
  // We can't use the body if the user is in fullscreen mode,
  // because the preview will render under the fullscreen element.
  // TODO(crisbeto): dedupe this with the `FullscreenOverlayContainer` eventually.
  return documentRef.fullscreenElement ||
         documentRef.webkitFullscreenElement ||
         documentRef.mozFullScreenElement ||
         documentRef.msFullscreenElement ||
         documentRef.body;
}
