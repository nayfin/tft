import { Directive, ElementRef, Input, OnInit, Output,
   EventEmitter, Optional, SimpleChanges, OnChanges } from '@angular/core';
import interact from 'interactjs';
import { DraggableOptions, GesturableOptions, Interactable, GestureEvent } from '@interactjs/types/index';
import { Observable } from 'rxjs';
import { TftCoords, TftGestureEvent } from '../models';
import { DraggableDirective } from '../directives';

/** @dynamic */
@Directive({
  selector: '[tftGesturable]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    // '[style.touchAction]': 'this.gestureDisabled ? "auto" : "none"',
    '[id]': 'gesturableId',
  }
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GesturableDirective<D = any> implements OnInit, OnChanges {

  @Input() gesturableId: string;
  @Input() gestureDisabled = false;
  @Input() gestureConfig: Partial<Interact.OrBoolean<DraggableOptions>>;
  // pipes all interact events to event emitters
  @Output() gestureStart = new EventEmitter<TftGestureEvent>();
  @Output() gestureMove = new EventEmitter<TftGestureEvent>();
  @Output() gestureEnd = new EventEmitter<TftGestureEvent>();

  interactableState: Observable<TftCoords>;
  interactable: Interactable;

  constructor(
    public el: ElementRef,
    @Optional() private draggable_dir?: DraggableDirective,
  ) { }

  ngOnInit() {
    this.gesturableId = this.draggable_dir?.interactableId || 'something';
    this.interactable = this.initiateGestureEvents(this.gestureConfig, this.el.nativeElement);
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

  initiateGestureEvents(gestureConfig: Partial<Interact.OrBoolean<GesturableOptions>>, nativeElement: HTMLElement) {

    const defaultConfig: GesturableOptions = {
      enabled:  !this.gestureDisabled,
    };

    return interact(nativeElement).gesturable({...defaultConfig, ...gestureConfig})
      .on('gesturestart', (event: GestureEvent) => {
        this.gestureStart.emit({gestureRef: this, interactEvent: event})
      })
      .on('gesturemove', (event: GestureEvent) => {
        this.gestureMove.emit({gestureRef: this, interactEvent: event})
      })
      .on('gestureend', (event: GestureEvent) => {
        this.gestureEnd.emit({gestureRef: this, interactEvent: event})
      })
  }
}
