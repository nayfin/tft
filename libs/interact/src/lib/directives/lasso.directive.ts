import {
  computed,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface LassoRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * Directive that handles lasso (drag-to-select) interaction geometry.
 * Manages mouse tracking, the visual selection rectangle, and click suppression.
 * Domain-specific hit-testing (what got selected) is the consumer's responsibility:
 * listen to `(lassoCommit)` with the viewport-space bounding rect and query your own elements.
 *
 * Usage:
 * ```html
 * <div tftLasso #lasso="tftLasso" [scale]="scale"
 *      (lassoStart)="onStart()" (lassoCommit)="onCommit($event)">
 *   @if (lasso.lassoDisplayRect(); as r) {
 *     <div class="lasso-rect" [style.left.px]="r.x" [style.top.px]="r.y"
 *                              [style.width.px]="r.w" [style.height.px]="r.h"></div>
 *   }
 * </div>
 * ```
 */
@Directive({
  selector: '[tftLasso]',
  exportAs: 'tftLasso',
  standalone: true,
  host: {
    '[style.touch-action]': 'lassoDisabled() ? "auto" : "none"',
  },
})
export class LassoDirective {
  private host = inject(ElementRef<HTMLElement>);

  /** Scale factor applied to the host element — used to convert viewport px to container-local px. */
  scale = input(1);
  /** When true, lasso interaction is disabled. */
  lassoDisabled = input(false);

  /** Emitted on pointerdown (before any drag). Use to clear previous selection state. */
  lassoStart = output<void>();
  /**
   * Emitted on pointerup when the drag exceeded the 5 px threshold.
   * Rect is in viewport (clientX/Y) space — pass directly to getBoundingClientRect comparisons.
   */
  lassoCommit = output<LassoRect>();

  // -------------------------------------------------------------------------
  // Internal state
  // -------------------------------------------------------------------------
  private _startVP: { x: number; y: number } | null = null;
  private _currentVP: { x: number; y: number } | null = null;
  private _startLocal = signal<{ x: number; y: number } | null>(null);
  private _currentLocal = signal<{ x: number; y: number } | null>(null);
  private _suppressNextClick = false;
  private _activePointerId: number | null = null;

  /** True while a lasso drag is in progress. */
  isLassoing = signal(false);

  /**
   * Rectangle in container-local CSS pixels (pre-divided by scale) — bind directly to
   * [style.left.px], [style.top.px], [style.width.px], [style.height.px].
   * Null when no drag is in progress.
   */
  lassoDisplayRect = computed(
    (): { x: number; y: number; w: number; h: number } | null => {
      const s = this._startLocal();
      const c = this._currentLocal();
      if (!s || !c || !this.isLassoing()) return null;
      return {
        x: Math.min(s.x, c.x),
        y: Math.min(s.y, c.y),
        w: Math.abs(c.x - s.x),
        h: Math.abs(c.y - s.y),
      };
    }
  );

  private toLocal(vpX: number, vpY: number): { x: number; y: number } {
    const rect = this.host.nativeElement.getBoundingClientRect();
    return {
      x: (vpX - rect.left) / this.scale(),
      y: (vpY - rect.top) / this.scale(),
    };
  }

  // -------------------------------------------------------------------------
  // Event handling
  // -------------------------------------------------------------------------

  @HostListener('pointerdown', ['$event'])
  onPointerDown(e: PointerEvent) {
    if (this.lassoDisabled()) return;
    if (e.target !== e.currentTarget) return; // ignore clicks on children
    this._activePointerId = e.pointerId;
    this.host.nativeElement.setPointerCapture(e.pointerId); // track movement outside element bounds
    this._startVP = { x: e.clientX, y: e.clientY };
    this._currentVP = { x: e.clientX, y: e.clientY };
    this._startLocal.set(this.toLocal(e.clientX, e.clientY));
    this._currentLocal.set(this.toLocal(e.clientX, e.clientY));
    this.isLassoing.set(true);
    this.lassoStart.emit();
    e.preventDefault();
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(e: PointerEvent) {
    if (!this.isLassoing() || e.pointerId !== this._activePointerId) return;
    this._currentVP = { x: e.clientX, y: e.clientY };
    this._currentLocal.set(this.toLocal(e.clientX, e.clientY));
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  onPointerUp(e: PointerEvent) {
    if (!this.isLassoing() || e.pointerId !== this._activePointerId) return;
    this.isLassoing.set(false);
    this._activePointerId = null;
    const s = this._startVP!;
    const c = this._currentVP!;
    this._startVP = null;
    this._currentVP = null;
    this._startLocal.set(null);
    this._currentLocal.set(null);

    // Treat tiny drags (< 5 px) as background clicks — clear, don't commit
    if (Math.abs(c.x - s.x) < 5 && Math.abs(c.y - s.y) < 5) return;

    this._suppressNextClick = true;
    this.lassoCommit.emit({
      left: Math.min(s.x, c.x),
      right: Math.max(s.x, c.x),
      top: Math.min(s.y, c.y),
      bottom: Math.max(s.y, c.y),
    });
  }

  /** Suppresses the click event that fires immediately after a real lasso drag ends. */
  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    if (this._suppressNextClick) {
      this._suppressNextClick = false;
      e.stopPropagation();
    }
  }
}
