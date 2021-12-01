
import { Injectable, Renderer2, RendererFactory2, NgZone, Inject, Optional } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap, map, shareReplay } from 'rxjs/operators';
import {
  TftCoords, Delta, Size, Position, InteractableRegistry,
  defaultPosition, defaultSize, defaultDelta, DEFAULT_REGISTRY_ID, TftDragElement, TftResizeElement, INTERACT_ROOT_CONFIG, InteractRootConfig
} from '../models';



@Injectable({providedIn: 'root'})
export class InteractService {

  private _interactableIndex = 0;
  private _dropzoneIndex = 0;
  private renderer: Renderer2;

  // TODO: consider using Map here
  readonly dragRegistrySystem: { [key: string]: InteractableRegistry } = { };
  private cssUnit = 'px'
  constructor(
    private rendererFactory: RendererFactory2,
    private ngZone: NgZone,
    @Optional() @Inject(INTERACT_ROOT_CONFIG) public rootConfig
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.cssUnit = rootConfig?.cssDimensionUnit || 'px';
  }

  addDeltaToPosition(delta: Delta, position: Position) {
    return {
      x: delta.deltaX + position.x,
      y: delta.deltaY + position.y,
      targetElement: position.targetElement || delta.targetElement
    }
  }

  addRegistryToSystem(customRegistryId: string | null = null) {
    const registryId = customRegistryId || this.createDropzoneId(this._dropzoneIndex++);
    this.dragRegistrySystem[registryId] = {};
    return registryId;
  }

  addDraggableToRegistry(customRegistryId = null, interactableId: string | null = null ) {
    const registryId = customRegistryId || DEFAULT_REGISTRY_ID;
    // if we pass an id to createInteractableId then it is used when creating the interactable
    // and returned, otherwise a new id is created for the draggable.
    const key = this.createInteractableId(interactableId );
    if (!Object.prototype.hasOwnProperty.call(this.dragRegistrySystem, registryId)) {
      this.dragRegistrySystem[registryId] = {};
    }
    this.dragRegistrySystem[registryId][key] = this.createInteractableState(defaultPosition, defaultSize, defaultDelta);
    return key
  }

  destroyInteractable(interactableId: string, registryId = DEFAULT_REGISTRY_ID) {
    const interactableSystem =this.dragRegistrySystem[registryId][interactableId];
    if(interactableSystem) {
      // unsubscribe from all the subscriptions if they're subscriptions
      for (const propName in interactableSystem)  {
        const prop = interactableSystem[propName];
        if (prop.unsubscribe && typeof prop.unsubscribe === 'function' ) {
          prop.unsubscribe();
        };
      }
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
    const interactable$: Observable<TftCoords> = combineLatest([
      size$.pipe(
        // startWith({...initialSize, ...initialDelta}),
        shareReplay(1),
        // filter(resizeEvent => !!resizeEvent.targetElement),
        tap(({deltaX, deltaY, width, height, targetElement}) => {
          this.ngZone.runOutsideAngular(() => {
            this.setElementSize(width, height, targetElement);
          });
          // only reposition if necessary i.e when resizing left or up
          if(deltaX || deltaY) {
            deltas$.next({deltaX, deltaY, targetElement});
          }
        })
      ),
      deltas$.pipe(
        shareReplay(1),
        tap((delta) => {
          const position = position$.value;
          const newPosition = this.addDeltaToPosition(delta, position);
          position$.next(newPosition);
        })
      ),
      position$.pipe(
        shareReplay(1),
        tap( position => {
          this.ngZone.runOutsideAngular(() => {
            this.setElementTransform(position.x, position.y, position);
          })
        })
      )
      ]).pipe(
      shareReplay(1),
      map( ([size, deltas, position]): TftCoords=> {
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

  updatePosition(interactId: string, registryId: string, { x, y }: {x: number; y: number;}, targetElement) {
    if (!this.interactableExistOnRegistry(interactId, registryId)) return;
    this.dragRegistrySystem[registryId][interactId].position$.next({ x, y, targetElement })
  }

  updateSize(interactId: string, registryId: string, { deltaX, deltaY, width, height }, targetElement) {
    if (!this.interactableExistOnRegistry(interactId, registryId)) return
    this.dragRegistrySystem[registryId][interactId].size$.next({deltaX, deltaY, width, height, targetElement});
  }

  interactableExistOnRegistry(interactId: string, registryId = DEFAULT_REGISTRY_ID) {
    // eslint-disable-next-line no-prototype-builtins
    return this.dragRegistrySystem.hasOwnProperty(registryId) && this.dragRegistrySystem[registryId].hasOwnProperty(interactId);
  }
  /**
   * Uses renderer to set width and height of angular component
   * @param width the desired width of component
   * @param height the desired height of component
   * @param target the element to transform
   */
  setElementSize(width: number, height: number, target: TftResizeElement) {
    if(!target) return;
    this.renderer.setStyle(target, 'width', `${width}${this.cssUnit}`);
    this.renderer.setStyle(target, 'height', `${height}${this.cssUnit}`);
  }
  /**
   * Uses renderer to set position of angular component
   * @param x position on x axis
   * @param y position on y axis
   * @param target the element to transform
   */
  setElementTransform(x: number, y: number, position: Position ) {
    if(!position?.targetElement) return;
    this.renderer.setStyle(position.targetElement, 'left', `${x}${this.cssUnit}`);
    this.renderer.setStyle(position.targetElement, 'top', `${y}${this.cssUnit}`);
  }
  /**
   * Generates a translate string for the x and y arguments passed to
   * be passed to css transform
   * @param x the position along the x axis
   * @param y the position along the y axis
   */
  createTransformString(x: number, y: number) {
    return `translate3d(${x}${this.cssUnit}, ${y}${this.cssUnit}, 0)`
  }

  calculatePositionInElement(zoneElement: Interact.Element, dragElement: TftDragElement, scale?: number) {
    // TODO: this calculation may not cover a lot of scenarios, keep an eye out for possible improvements
    const zoneRect = zoneElement.getBoundingClientRect();
    const dragRect = dragElement.getBoundingClientRect();
    const position = scale
      ? {
      x: (dragRect.left - zoneRect.left) / scale  || 1,
      y: (dragRect.top - zoneRect.top) / scale || 1
      } : {
        x: dragRect.left - zoneRect.left,
        y: dragRect.top - zoneRect.top
    };
    // console.log({ y:position.y, drt:dragRect.top, zrt: zoneRect.top})
    return position;
  }
}
