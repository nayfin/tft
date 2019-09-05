import { Directive, OnInit, OnDestroy, ElementRef, Input, Optional, SkipSelf, Output, EventEmitter} from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { ResizableOptions } from '@interactjs/types/types';
import { DraggableDirective } from './draggable.directive';
import { Subscription } from 'rxjs';
import { ResizeEvent } from '@interactjs/actions';
import { DropzoneDirective } from './dropzone.directive';
@Directive({
  selector: '[tftResizable]',
  host: {    
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',
  }
})
export class ResizableDirective implements OnInit, OnDestroy {

  // location$: Observable<{x: number, y: number, el: any}> = this.interactService.location$;
  @Input() enableResizeDefault = true;

  @Input() resizeConfig: Partial<Interact.OrBoolean<ResizableOptions>>;
  @Input() interactableId: string;
  
  @Output() resizeStart = new EventEmitter<ResizeEvent>();
  @Output() resizeMove = new EventEmitter<ResizeEvent>();
  @Output() resizeInertiaStart = new EventEmitter<ResizeEvent>();
  @Output() resizeEnd = new EventEmitter<ResizeEvent>();

  defaultConfig: Partial<Interact.OrBoolean<ResizableOptions>> = {
    edges: { left: true, right: true, bottom: true, top: true },
    onstart:  (event: ResizeEvent) => this.resizeStart.emit(event),
    onmove: (event: ResizeEvent) => {
      if (this.enableResizeDefault) {
        this.resizeListener(event)
      }
      this.resizeMove.emit(event)
    },
    oninertiastart:  (event: ResizeEvent) => this.resizeInertiaStart.emit(event),
    onend: (event: ResizeEvent) => this.resizeEnd.emit(event),

  };

  private interactableSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private interactService: InteractService,
    @Optional() private draggable_dir?: DraggableDirective,
    @Optional() @SkipSelf() private dropzone_dir?: DropzoneDirective
  ) { }

  ngOnInit() {
    const resizable = this.el.nativeElement;
    // console.log({drop: this.dropzone_dir})
    interact(resizable).resizable({...this.defaultConfig, ...this.resizeConfig})

    this.interactableId = this.draggable_dir && this.draggable_dir.interactableId
      ? this.draggable_dir.interactableId
      : this.interactService.addDraggableToRegistry();

    this.interactableSubscription = this.interactService.dragRegistry[this.interactableId].draggable$.subscribe();
    const registry = this.interactService.dragRegistry;
    console.log('initializing resizable directive', registry);
  }

  ngOnDestroy() {
    this.interactableSubscription.unsubscribe();
    this.interactService.destroyInteractable(this.interactableId);
  }

  resizeListener(event: ResizeEvent) {
    const deltaX = event.deltaRect.left;
    const deltaY = event.deltaRect.top;
    const width  = event.rect.width;
    const height = event.rect.height;
    this.interactService.updateSize(this.interactableId, { deltaX, deltaY, width, height}, this.el.nativeElement);  
    
  }
}