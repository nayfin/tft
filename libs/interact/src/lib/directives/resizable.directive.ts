import { Directive, AfterViewInit, ElementRef, Input} from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { ResizableOptions } from '@interactjs/types/types';
import { Options } from '@interactjs/core/defaultOptions';
import { Observable } from 'rxjs';

@Directive({
  selector: '[tftResizable]'
})
export class ResizableDirective implements AfterViewInit {

  // location$: Observable<{x: number, y: number, el: any}> = this.interactService.location$;

  @Input() resizeConfig: ResizableOptions;
  defaultConfig: Options = {
    drag: {onend: console.log}
  };
  constructor(
    private el: ElementRef,
    private interactService: InteractService
  ) { }

  ngAfterViewInit() {
    const resizable = this.el.nativeElement;
    interact(resizable).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
    }).on('resizemove', this.resizeListener( resizable));
  }

  resizeListener( nativeElement ) {
    return (event) => {
      const deltaX = event.deltaRect.left;
      const deltaY = event.deltaRect.top;
      const width  = event.rect.width;
      const height = event.rect.height;
      this.interactService.updateSize({ deltaX, deltaY, width, height}, nativeElement);  
    }
  }
}