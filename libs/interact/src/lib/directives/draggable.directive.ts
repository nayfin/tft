import { Directive, ElementRef, Input, OnInit, Output,
   OnDestroy, EventEmitter, Optional, SkipSelf, Renderer2 } from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions } from '@interactjs/types/types';
import { Subscription, Observable } from 'rxjs';
import { DragEvent } from '@interactjs/actions';
import { DropzoneDirective } from './dropzone.directive';
import { NgDragEvent, TftDragEvent, DEFAULT_REGISTRY_ID, TftInteractable } from '../models';
import Interactable from '@interactjs/core/Interactable';
import { tap } from 'rxjs/operators';

@Directive({
  selector: '[tftDraggable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {    
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',
    '[id]': 'interactableId',
  }
})
export class DraggableDirective implements OnInit, OnDestroy {

  DEFAULT_CONFIG: Partial<Interact.OrBoolean<DraggableOptions>> = {
    autoScroll: true,
    onstart: (event: NgDragEvent) => {
      if (this.disabled) return;
      this.dragStart.emit(this.mapDragEvent(event));
    },
    onmove: (event: NgDragEvent) => {
      if (this.disabled) return;
      if (this.enableDragDefault) {
        this.dragMoveListener(event);
      }
      const mappedEvent = this.mapDragEvent(event);
      this.dragMove.emit(mappedEvent);
    },
    oninertiastart: (event: NgDragEvent) => {
      if (this.disabled) return;
      this.dragInertiaStart.emit(this.mapDragEvent(event))
    },
    onend: (event: NgDragEvent) => {
      if (this.disabled) return;
      this.dragEnd.emit(this.mapDragEvent(event))
    },  
  }

  private registryId: string;

  private interactableSubscription: Subscription;
  
  // getters and setters for x and y  
  private _x: number;
  @Input() set x(val: number) {
    if (val === this._x) return;
    this._x = val;
    this.alignPositionWithInputs(val,  this.y);
  };
  get x() {
    return this._x;
  }
  // getters and setters for y
  private _y: number;
  @Input() set y(val: number) {
    if (val === this._y) return;
    this._y = val;
    this.alignPositionWithInputs(this.x, val);
  }; 
  get y() {
    return this._y;
  }

  @Input() interactableId: string;
  @Input() dragData: any;
  @Input() enableDragDefault = true;
  @Input() disabled = false;
  @Input() dragConfig: Partial<Interact.OrBoolean<DraggableOptions>>;
  
  // pipes all interact events to event emitters 
  @Output() dragStart = new EventEmitter<TftDragEvent>();
  @Output() dragMove = new EventEmitter<TftDragEvent>();
  @Output() dragInertiaStart = new EventEmitter<TftDragEvent>();
  @Output() dragEnd = new EventEmitter<TftDragEvent>();
  interactableState: Observable<TftInteractable>;
  interactable: Interactable;
  constructor(
    // public cdr: ChangeDetectorRef,
    public el: ElementRef,
    private interactService: InteractService,
    private renderer: Renderer2,
    @Optional() @SkipSelf() public dropzone_dir?: DropzoneDirective
  ) { }

  ngOnInit() {
    this.interactService.checkForOverridesInConfig(this.dragConfig, ['onstart', 'onmove', 'onend', 'oninertiastart']);
    
    this.interactable = interact(this.el.nativeElement).draggable({ ...this.DEFAULT_CONFIG, ...this.dragConfig });
      // .on('dragresume', (event: NgDragEvent) => {  });

    // Set our target and origin to the parent zone, since we're starting here
    this.el.nativeElement.dropTarget = this.el.nativeElement.dragOrigin = this.dropzone_dir || null;
    // register with parent dropzone if it exists, otherwise use default
    this.registryId = this.dropzone_dir && this.dropzone_dir.dropzoneId
      ? this.dropzone_dir.dropzoneId
      : DEFAULT_REGISTRY_ID; 
    // add draggable to directory and store its id 
    this.interactableId = this.interactService.addDraggableToRegistry(this.registryId, this.interactableId);
    // cache subscription to interactable so we can unsubscribe onDestroy
    this.interactableState = this.interactService
      .getInteractableState(this.interactableId, this.registryId).pipe(tap(console.log));
    console.log(this.interactableState.subscribe());
    this.interactableSubscription = this.interactableState.subscribe((state) => { console.log({state})})
    
    // we create a property 'dragRef' on the element so that we can easily pass the class to the drop zone
    this.renderer.setProperty(this.el.nativeElement, 'dragRef', this);
    this.alignPositionWithInputs(this.x, this.y);
  };

  ngOnDestroy() {
    // clean up state and subscriptions related to destroyed component
    this.interactableSubscription.unsubscribe();
    this.interactService.destroyInteractable(this.interactableId, this.registryId);
  }

  dragMoveListener(event: NgDragEvent) {
    const { dx, dy } = event;
    // TODO: this should be done by hooking into interactable$
    this._x += dx;
    this._y += dy;

    this.interactService.updateDeltas(
      this.interactableId, 
      this.registryId, 
      {deltaX: dx, deltaY: dy}, 
      this.el.nativeElement
    );
  }

  mapDragEvent(event: NgDragEvent): TftDragEvent {
    const { target } = event;
    const relatedTarget = target.dropTarget 
      ? target.dropTarget.el.nativeElement 
      : null;
    const positionInDropTarget = target && relatedTarget
      ? this.interactService.calculatePositionInDropzone(relatedTarget, target)
      : null;
    return {
      interactEvent: event,
      dragRef: this, 
      dragOrigin: target.dragOrigin,
      dropTarget: this.el.nativeElement.dropTarget,
      positionInDropTarget
    }
  }
  
  setPosition(x: number, y: number) {
    // TODO: setting these caches on class is stupid, should be way to hook into state of interact service
    this._x = y;
    this._y = y
    this.interactService.updatePosition(
      this.interactableId,
      this.registryId,
      {x, y},
      this.el.nativeElement
    );
  }

  alignPositionWithInputs(x: number, y: number) {
    // short circuit if positions aren't numbers or  if they haven't changed
    if(!this.isValidPosition(x, y)) return;
  
    this.interactService.updatePosition(
      this.interactableId, 
      this.registryId,
      {x, y}, 
      this.el.nativeElement
    );
    
  }

  isValidPosition(x: number, y: number) {
    return this.isNumeric(x) && this.isNumeric(y);
  }
  // We use use this instead of isNaN here to try and help performance
  // We should be able to reliably restrict to numbers or falsey values
  isNumeric(num: number) {
    return typeof num === 'number' && num !== NaN;
  }

  
  // TODO: this doesn't do anything yet...
  // eventually it should create a clone of the component passed
  // in and add it to the root component
  cloneElement(element: HTMLElement) {
    const elementRect = element.getBoundingClientRect()
    const clone = element.cloneNode(true) as HTMLElement;
    element.style.transform = this.interactService.createTransformString(elementRect.left, elementRect.top);
    const interactId = this.interactService.addDraggableToRegistry();
    // clone.draggable = true;
    this.interactService.updatePosition(interactId, DEFAULT_REGISTRY_ID, {x:40, y: 90}, clone);
    clone.removeAttribute('id');
    // TODO: remove this, only using now to try and get clone to display
    clone.style.width = '150px';
    clone.style.height = '150px';
    return clone;
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
