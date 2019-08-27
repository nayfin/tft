import { Directive, AfterViewInit, ElementRef} from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';

@Directive({
  selector: '[tftResizable]'
})
export class ResizableDirective implements AfterViewInit {

  // location$: Observable<Location> = this.locationService.location$;


  constructor(
    private el: ElementRef,
    private interactService: InteractService
    // private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    const resizable = this.el.nativeElement;
    interact(resizable).resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },
      // keep the edges inside the parent
      // restrictEdges: {
      //   outer: 'parent',
      //   endOnly: true,
      // },
      inertia: true,
    }).on('resizemove', (event) => { this.resizeListener(event, resizable)});
  }

  resizeListener(event, nativeElement ) {
    const target = nativeElement;
    const deltaX = event.deltaRect.left;
    const deltaY = event.deltaRect.top;
    const width = event.rect.width;
    const height = event.rect.height;
    // this.x = (parseFloat(target.getAttribute('data-x')) || 0),
    // this.y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    // target.style.width  = event.rect.width + 'px';
    // target.style.height = event.rect.height + 'px';

    this.interactService.updateSize({ deltaX, deltaY, width, height}, target);
    
  
  }
}