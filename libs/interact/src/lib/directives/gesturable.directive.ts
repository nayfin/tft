import { Directive, ElementRef, Input, OnInit, Output,
   OnDestroy, EventEmitter, Optional, SkipSelf, Renderer2, SimpleChanges, OnChanges, ContentChild, ViewContainerRef, Inject, AfterViewInit } from '@angular/core';
// import { DOCUMENT } from '@angular/common'
import interact from 'interactjs';
// import { InteractService } from '../services/interact.service';
import { DraggableOptions, GesturableOptions, Interactable } from '@interactjs/types/index';
import { Subscription, Observable } from 'rxjs';
// import { DropzoneDirective } from './dropzone.directive';
import { NgDragEvent, TftDragEvent, DEFAULT_REGISTRY_ID, TftCoords, TftDragElement} from '../models';
// import { DragPreviewDirective } from './drag-preview.directive';
// import { getRootNode } from '../utils';

/** @dynamic */
@Directive({
  selector: '[tftGesturable]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[style.touchAction]': 'this.gestureDisabled ? "auto" : "none"',
    // '[style.position]': '"absolute"',
    '[id]': 'gesturableId',
  }
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GesturableDirective<D = any> implements OnInit, OnChanges, OnDestroy, AfterViewInit {


  // @Input() x: number;
  // @Input() y: number;
  /* zIndex while dragging*/
  // @Input() dragZIndex = 10000;
  /** zIndex while at rest */
  // @Input() zIndex: number
  @Input() gesturableId: string;
  // @Input() dragData: D;

  @Input() enableDragDefault = true;

  @Input() gestureDisabled = false;
  @Input() gestureConfig: Partial<Interact.OrBoolean<DraggableOptions>>;
  @Input() showPlaceholder = false;
  // pipes all interact events to event emitters
  @Output() gestureStart = new EventEmitter<TftDragEvent>();
  @Output() gestureMove = new EventEmitter<TftDragEvent>();
  @Output() gestureInertiaStart = new EventEmitter<TftDragEvent>();
  @Output() gestureEnd = new EventEmitter<TftDragEvent>();

  // @ContentChild(DragPreviewDirective) _previewTemplate: DragPreviewDirective;
  // dragPreview: Interact.Element;
  interactableState: Observable<TftCoords>;
  interactable: Interactable;
  // private registryId: string;
  // private interactableSubscription: Subscription;
  // cache holding element to use as drag preview (the element the user sees being dragged around)
  previewRef: TftDragElement;
  // cache holding element to use as placeholder while dragging
  constructor(
    public el: ElementRef,
    // private interactService: InteractService,
    // private renderer: Renderer2,
    // private _viewContainerRef: ViewContainerRef,
    // @Inject(DOCUMENT) private _document: Document,
    // @Optional() @SkipSelf() public dropzone_dir?: DropzoneDirective
  ) { }

  ngOnInit() {
    this.interactable = this.initiateGestureEvents(this.gestureConfig, this.el.nativeElement);
    console.log('gestureOnInit', this.interactable);
    // register with parent dropzone if it exists, otherwise use default
    // this gives us a place on the registry to store our drag items that don't have a dropzone
    // this.registryId = this.dropzone_dir?.dropzoneId || DEFAULT_REGISTRY_ID;

    // add gesturable to directory and store its id
    // this.gesturableId = this.interactService.addDraggableToRegistry(this.registryId, this.gesturableId);

    // this.alignPositionWithInputs(this.x, this.y);

    // cache subscription to interactable state so we can unsubscribe onDestroy
    // this.interactableState = this.interactService
    //   .getInteractableState(this.gesturableId, this.registryId);

    // keep our cached position values in line with our drag state
    // this.interactableSubscription = this.interactableState.subscribe((state) => {
    //   this.y = state.y;
    //   this.x = state.x;
    // });
    this.setGestureConfig();
  }

  // TODO: watch config here as well and update interactable
  ngOnChanges(changes: SimpleChanges) {
    // we do this here instead of using a setter on the input so that it
    // will only run once when there is a change to x and y
    if(changes.gestureConfig || changes.gestureDisabled) {
      if(!this.interactable) return;
      this.setGestureConfig();
    }
  }

  setGestureConfig() {
    const enabled = !this.gestureDisabled;
    const gestureConfig = {...this.gestureConfig, enabled};
    this.interactable.gesturable(gestureConfig);
  }

  ngAfterViewInit() {
    console.log('gestureAfterInit', this.interactable);

    // this.addDragPropertiesToElement(this.el.nativeElement);
    // if (!this.dropzone_dir) {
    //   this.previewRef = this.el.nativeElement;
    // }
  }

  ngOnDestroy() {
    // clean up state and subscriptions related to destroyed component
    // this.interactableSubscription.unsubscribe();
    // this.interactService.destroyInteractable(this.gesturableId, this.registryId);
  }

  dragMoveListener(event: NgDragEvent, element: Interact.Element) {
    // const { dx, dy } = event;
    // this.interactService.updateDeltas(
    //   this.gesturableId,
    //   this.registryId,
    //   {deltaX: dx, deltaY: dy},
    //   element
    // );
  }

  setDragStyles(dragElement: HTMLElement) {
    // this.renderer.setStyle(dragElement, 'touchAction', 'none')
    // // this.renderer.setStyle(dragElement, 'zIndex', this.dragZIndex)
    // this.renderer.setStyle(dragElement, 'position', 'fixed')
  }

  addDragPropertiesToElement(nativeElement: TftDragElement) {
    // this.renderer.setProperty(nativeElement, 'dropTarget', this.dropzone_dir || null);
    // this.renderer.setProperty(nativeElement, 'dragOrigin', this.dropzone_dir || null);
    // this.renderer.setProperty(nativeElement, 'dragRef', this);
  }

  setPosition(x: number, y: number) {
    // this.interactService.updatePosition(
    //   this.gesturableId,
    //   this.registryId,
    //   {x, y},
    //   this.el.nativeElement
    // );
  }

  // alignPositionWithInputs(x: number, y: number) {
  //   // short circuit if positions aren't numbers or  if they haven't changed
  //   // if(!this.isValidPosition(x, y)) return;
  //   // this.interactService.updatePosition(
  //   //   this.gesturableId,
  //   //   this.registryId,
  //   //   {x, y},
  //   //   this.el.nativeElement
  //   // );
  // }

  // isValidPosition(x: number, y: number) {
  //   return this.isNumeric(x) && this.isNumeric(y);
  // }
  // We use use this instead of isNaN here to try and help performance
  // We should be able to reliably restrict to numbers or falsey values
  // isNumeric(num: number) {
  //   return typeof num === 'number' && !isNaN(num);
  // }

  initiateGestureEvents(gestureConfig: Partial<Interact.OrBoolean<GesturableOptions>>, nativeElement: HTMLElement) {

    const defaultConfig: GesturableOptions = {
      enabled:  !this.gestureDisabled,
      onstart: (thing1, thing2) => {
        console.log('onstarting', thing1, thing2)
      }
    }
    return interact(nativeElement).gesturable({...defaultConfig, ...gestureConfig})
      .on('move', (thing1, thing2) => {
        console.log('on.moving', thing1, thing2)
      })
  }


}
