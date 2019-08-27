import { Directive, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions } from '@interactjs/types/types';


@Directive({
  selector: '[tftDraggable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {    
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',

  },
  providers: [InteractService]
})
export class DraggableDirective implements OnInit, AfterViewInit {

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
  constructor(
    private el: ElementRef,
    private interactService: InteractService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const draggable = this.el.nativeElement;
    interact(draggable).draggable({ ...this.DEFAULT_OPTIONS, ...this.dragOptions });  
  }

  dragMoveListener(event) {
    event.preventDefault();
    event.stopPropagation();
    this.interactService.updateLocation({deltaX: event.dx, deltaY: event.dy}, this.el.nativeElement);
  }




}


