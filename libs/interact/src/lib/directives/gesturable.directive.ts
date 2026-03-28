import { Directive, ElementRef, OnInit, output, input, inject, effect } from '@angular/core';
import interact from 'interactjs';
import { DraggableOptions, GesturableOptions, Interactable, GestureEvent } from '@interactjs/types/index';
import { Observable } from 'rxjs';
import { TftCoords, TftGestureEvent } from '../models';
import { DraggableDirective } from '../directives';

/** @dynamic */
@Directive({
  selector: '[tftGesturable]',
  standalone: true,
  host: {
    // '[style.touch-action]': 'gestureDisabled() ? "auto" : "none"',
    '[id]': 'gesturableId()',
  },
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GesturableDirective<D = any> implements OnInit {
  el = inject(ElementRef);
  private draggable_dir = inject(DraggableDirective, { optional: true });

  gesturableId = input<string>();
  gestureDisabled = input(false);
  gestureConfig = input<Partial<Interact.OrBoolean<DraggableOptions>>>();

  gestureStart = output<TftGestureEvent>();
  gestureMove = output<TftGestureEvent>();
  gestureEnd = output<TftGestureEvent>();

  interactableState: Observable<TftCoords>;
  interactable: Interactable;

  constructor() {
    effect(() => {
      this.gestureConfig(); this.gestureDisabled();
      if (!this.interactable) return;
      this.setGestureConfig();
    });
  }

  ngOnInit() {
    this.interactable = this.initiateGestureEvents(this.gestureConfig(), this.el.nativeElement);
    this.setGestureConfig();
  }

  setGestureConfig() {
    const enabled = !this.gestureDisabled();
    const gestureConfig = { ...this.gestureConfig(), enabled };
    this.interactable.gesturable(gestureConfig);
  }

  initiateGestureEvents(gestureConfig: Partial<Interact.OrBoolean<GesturableOptions>>, nativeElement: HTMLElement) {
    const defaultConfig: GesturableOptions = {
      enabled: !this.gestureDisabled(),
    };
    const interactable = this.draggable_dir?.interactable || interact(nativeElement);

    return interactable.gesturable({ ...defaultConfig, ...gestureConfig })
      .on('gesturestart', (event: GestureEvent) => {
        this.gestureStart.emit({ gestureRef: this, interactEvent: event });
      })
      .on('gesturemove', (event: GestureEvent) => {
        this.gestureMove.emit({ gestureRef: this, interactEvent: event });
      })
      .on('gestureend', (event: GestureEvent) => {
        this.gestureEnd.emit({ gestureRef: this, interactEvent: event });
      });
  }
}
