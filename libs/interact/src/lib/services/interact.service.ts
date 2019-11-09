
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap, filter, map, shareReplay } from 'rxjs/operators';
import { 
  TftInteractable, Delta, Size, Position, InteractableRegistry, 
  defaultPosition, defaultSize, defaultDelta, DEFAULT_REGISTRY_ID } from '../models';

@Injectable({providedIn: 'root'})
export class InteractService {
  
  private _interactableIndex = 0;
  private _dropzoneIndex = 0;
  private renderer: Renderer2;

  // get interactableCount() {
  //   return this._interactableIndex + 1;
  // }
  
  readonly dragRegistrySystem: { [key: string]: InteractableRegistry } = { };
  
  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  addDeltaToPosition(delta: Delta, position: Position) {
    return {
      x: delta.deltaX + position.x,
      y: delta.deltaY + position.y,
      targetElement: delta.targetElement
    }
  }

  addRegistryToSystem(customRegistryId: string | null = null) {
    const registryId = customRegistryId || this.createDropzoneId(this._dropzoneIndex++);
    this.dragRegistrySystem[registryId] = {};
    return registryId;
  }

  addDraggableToRegistry(registryId = null, interactableId: string | null = null ) {
    const defaultRegistryId = registryId || DEFAULT_REGISTRY_ID;
    // if we pass an id to createInteractableId then it is used when creating the interactable
    // and returned, otherwise a an id is created for the draggable. 
    const key = this.createInteractableId(interactableId );
    if (!this.dragRegistrySystem.hasOwnProperty(defaultRegistryId)) {
      this.dragRegistrySystem[defaultRegistryId] = {};
    }
    this.dragRegistrySystem[defaultRegistryId][key] = this.createInteractableState(defaultPosition, defaultSize, defaultDelta);
    return key
  }

  destroyInteractable(interactableId: string, registryId = DEFAULT_REGISTRY_ID) {
    if(this.dragRegistrySystem[registryId][interactableId]) {
      delete this.dragRegistrySystem[registryId][interactableId];
    }
  }

  subscribeToInteractable(interactableId: string, registryId = DEFAULT_REGISTRY_ID) {
    return this.dragRegistrySystem[registryId][interactableId];
  }

  createInteractableState(initialPosition: Position, initialSize: Size, initialDelta: Delta ) {
    
    const deltas$ = new BehaviorSubject(initialDelta);
    // tracks the size of the element
    const size$ = new BehaviorSubject({...initialSize, ...initialDelta});
    // Stream of positions as they change
    const position$ = new BehaviorSubject(initialPosition);
  
    // All draggable data mapped together
    const interactable$: Observable<TftInteractable> = combineLatest(
      size$.pipe(
        filter(resizeEvent => !!resizeEvent.targetElement),
        tap(({deltaX, deltaY, width, height, targetElement}) => {
          this.setElementSize(width, height, targetElement);
          // only reposition if necessary i.e when resizing left or up
          if(deltaX || deltaY) {
            deltas$.next({deltaX, deltaY, targetElement});
          }
        })
      ),
      deltas$.pipe(
        filter(delta => !!delta.targetElement),
        tap((delta) => {
          console.log('delta', delta          )
          const position = position$.value;
          const newPosition = this.addDeltaToPosition(delta, position);
          position$.next(newPosition);
        })
      ),
      position$.pipe(
        filter(position => !!position.targetElement),
        tap( position => this.setElementTransform(position.x, position.y, position.targetElement))
      )
    ).pipe(
      shareReplay(1),
      map( ([size, deltas, position]): TftInteractable => {
        
        return {
          x: position.x,
          y: position.y,
          deltaX: deltas.deltaX,
          deltaY: deltas.deltaY,
          width: size.width,
          height: size.height,
          targetElement: size.targetElement || position.targetElement || deltas.targetElement
        }
      }),  
    )
    // TODO: update system to handle only returning interactable$
    return {
      deltas$,
      position$,
      size$,
      interactable$
    }
  }

  createInteractableId(customInteractableId: string | null = null) {
    return customInteractableId || `interactable${this._interactableIndex++}`
  }

  createDropzoneId(index: number) {
    return `dropzone${index}`
  }

  getInteractableState( interactableId: string, registryId = DEFAULT_REGISTRY_ID) {
    return this.dragRegistrySystem[registryId][interactableId].interactable$;
  }
  
  updateDeltas(interactId: string, registryId: string, { deltaX, deltaY }, targetElement) {
    if (!this.interactableExistOnRegistry(interactId, registryId)) return;
    this.dragRegistrySystem[registryId][interactId].deltas$.next({ deltaX, deltaY, targetElement })
  }

  updatePosition(interactId: string, registryId: string, { x, y }, targetElement) {
    if (!this.interactableExistOnRegistry(interactId, registryId)) return;
    this.dragRegistrySystem[registryId][interactId].position$.next({ x, y, targetElement })
  }

  updateSize(interactId: string, registryId: string, { deltaX, deltaY, width, height }, targetElement) {
    if (!this.interactableExistOnRegistry(interactId, registryId)) return
    this.dragRegistrySystem[registryId][interactId].size$.next({deltaX, deltaY, width, height, targetElement});
  }

  interactableExistOnRegistry(interactId: string, registryId = DEFAULT_REGISTRY_ID) {
    return this.dragRegistrySystem.hasOwnProperty(registryId)
      && this.dragRegistrySystem[registryId].hasOwnProperty(interactId);
  }

  setElementSize(width: number, height: number, target: any) {
    this.renderer.setStyle(target, 'width', `${width}px`);
    this.renderer.setStyle(target, 'height', `${height}px`);
  }

  setElementTransform(x: number, y: number, target: any) {
    const transformString = this.createTransformString(x, y);
    this.renderer.setStyle(target, 'transform', transformString );
  }

  createTransformString(x: number, y: number) {
    return `translate3d(${x}px, ${y}px, 0)`
  }

  checkForOverridesInConfig(config: {}, keysToCheck: string[]) {
    // const keysToCheck = [];
    if(!config) return;
    keysToCheck.forEach( (key: string) => {
      if(config.hasOwnProperty(key)) {
        console.warn(`Default ${key} behavior has been overridden by the drag config. 
          You can avoid this by using the event listeners of the resize directive
        `)
      }
    });
  }

  calculatePositionInDropzone(zoneElement: Interact.Element, dragElement: HTMLElement) {
    const zoneRect = zoneElement.getBoundingClientRect(),
          dragRect = dragElement.getBoundingClientRect();
    return {
      x: dragRect.left - zoneRect.left,
      y: dragRect.top - zoneRect.top
    } 
  }
}
