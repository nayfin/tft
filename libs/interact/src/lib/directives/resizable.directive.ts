import { Directive, OnInit, OnDestroy, ElementRef, Input, Optional, SkipSelf} from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { ResizableOptions } from '@interactjs/types/types';
import { Options } from '@interactjs/core/defaultOptions';
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

  @Input() resizeConfig: ResizableOptions;
  @Input() interactableId: string;

  defaultConfig: Partial<Interact.OrBoolean<ResizableOptions>> = {
    onmove: (event: ResizeEvent) => this.resizeListener(event)
  };

  private interactableSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private interactService: InteractService,
    @Optional() private draggable_dir?: DraggableDirective,
    // @Optional() @SkipSelf() private _dropzone: DropzoneDirective
  ) { }

  ngOnInit() {
    const resizable = this.el.nativeElement;
    interact(resizable).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
    }).on('resizemove', this.resizeListener( resizable));

    if(this.draggable_dir && this.draggable_dir.interactableId) {
      this.interactableId = this.draggable_dir.interactableId;
    } else {
      this.interactableId = this.interactService.addDraggableToRegistry();
    }
    this.interactableSubscription = this.interactService.dragRegistry[this.interactableId].draggable$.subscribe();
  }

  ngOnDestroy() {
    this.interactableSubscription.unsubscribe();
  }

  resizeListener(nativeElement) {
    return (event) => {
      const deltaX = event.deltaRect.left;
      const deltaY = event.deltaRect.top;
      const width  = event.rect.width;
      const height = event.rect.height;
      this.interactService.updateSize(this.interactableId, { deltaX, deltaY, width, height}, nativeElement);  
    }
  }
}