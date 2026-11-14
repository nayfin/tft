import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { LassoDirective, LassoRect } from '@tft/interact';

interface LassoItem {
  id: string;
  /** Position inside the stage, in em (1em is `scale` pixels) */
  x: number;
  y: number;
}

const MODES = ['em', 'transform'] as const;
type Mode = typeof MODES[number];

/**
 * Items sit at fixed positions in em. The stage is drawn at `scale` pixels per em, so at different scales the
 * same lasso (in pixels) reaches a different set of items.
 */
const ITEMS: LassoItem[] = [
  { id: 'a', x: 30, y: 30 },
  { id: 'b', x: 100, y: 30 },
  { id: 'c', x: 30, y: 80 },
  { id: 'd', x: 200, y: 100 },
];

@Component({
  selector: 'tft-lasso-basics',
  imports: [LassoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../feature-page.scss',
  template: `
    <h1>Lasso basics</h1>
    <p>
      <code>tftLasso</code> turns a drag on the stage background into a
      selection rectangle. Like the other stages it sets the
      <code>font-size</code> to <code>scale</code> pixels, so the rectangle is
      bound in em (<code>[style.left.em]</code> and so on) and items are placed
      in em. The directive emits the committed rectangle in viewport pixels;
      hit-testing the items against it is up to the page.
    </p>
    <p>
      The mode switch picks how the page lays out the stage. <code>em</code>:
      the stage is sized in em and the rectangle is bound in em, as in the
      directive's doc comment and the README. <code>transform</code>: the stage
      is sized in px and drawn with <code>transform: scale()</code>, with the
      rectangle in px.
    </p>

    <section class="example">
      <div class="scale-options">
        @for (option of options; track option) {
        <button
          type="button"
          class="toggle"
          [attr.data-testid]="'lasso-scale-option-' + option"
          [attr.aria-pressed]="scale() === option"
          (click)="scale.set(option)"
        >
          {{ option }}
        </button>
        }
      </div>
      <div class="scale-options">
        @for (m of modes; track m) {
        <button
          type="button"
          class="toggle"
          [attr.data-testid]="'lasso-mode-' + m"
          [attr.aria-pressed]="mode() === m"
          (click)="mode.set(m)"
        >
          {{ m }}
        </button>
        }
      </div>
      <div
        class="stage-viewport"
        [style.height.px]="mode() === 'transform' ? 200 * scale() + 2 : null"
      >
        <div
          class="stage"
          [style.width.px]="mode() === 'transform' ? 480 : null"
          [style.height.px]="mode() === 'transform' ? 200 : null"
          [style.transform]="
            mode() === 'transform' ? 'scale(' + scale() + ')' : null
          "
          style="transform-origin: 0 0"
          tftLasso
          #lasso="tftLasso"
          [scale]="scale()"
          data-testid="lasso-stage"
          (lassoStart)="selected.set([])"
          (lassoCommit)="onCommit($event)"
        >
          @for (item of items; track item.id) {
          <div
            class="lasso-item"
            [class.selected]="selected().includes(item.id)"
            [attr.data-item-id]="item.id"
            [attr.data-testid]="'lasso-item-' + item.id"
            [style.left]="item.x + unit()"
            [style.top]="item.y + unit()"
            [style.width]="40 + unit()"
            [style.height]="30 + unit()"
          >
            <span class="label">{{ item.id }}</span>
          </div>
          } @if (lasso.lassoDisplayRect(); as r) { @if (mode() === 'em') {
          <div
            class="lasso-rect"
            data-testid="lasso-rect"
            [style.left.em]="r.x"
            [style.top.em]="r.y"
            [style.width.em]="r.w"
            [style.height.em]="r.h"
          ></div>
          } @else {
          <div
            class="lasso-rect"
            data-testid="lasso-rect"
            [style.left.px]="r.x"
            [style.top.px]="r.y"
            [style.width.px]="r.w"
            [style.height.px]="r.h"
          ></div>
          } }
        </div>
      </div>
      <dl class="readout">
        <dt>Scale</dt>
        <dd data-testid="lasso-scale-value">{{ scale() }}</dd>
        <dt>Mode</dt>
        <dd data-testid="lasso-mode-value">{{ mode() }}</dd>
        <dt>Selected</dt>
        <dd data-testid="lasso-selected">
          {{ selected().length ? selected().join(',') : 'none' }}
        </dd>
        <dt>Committed size (px)</dt>
        <dd>
          <span data-testid="lasso-commit-width">{{ commitSize().width }}</span
          >,
          <span data-testid="lasso-commit-height">{{
            commitSize().height
          }}</span>
        </dd>
      </dl>
    </section>
  `,
  styles: `
    .scale-options {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .scale-options .toggle {
      margin: 0;
    }
    .scale-options .toggle[aria-pressed='true'] {
      background: #1976d2;
      color: #fff;
    }
    /* At larger scales the stage is wider than the page column: scroll it instead of overflowing the page */
    .stage-viewport {
      max-width: 100%;
      overflow: auto;
      padding: 1px;
    }
    .stage {
      user-select: none;
    }
    .lasso-item {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      background: #90a4ae;
      color: #fff;
    }
    .lasso-item.selected {
      background: #1976d2;
    }
    .lasso-rect {
      position: absolute;
      box-sizing: border-box;
      border: 2px solid #d81b60;
      background: rgba(216, 27, 96, 0.12);
      pointer-events: none;
    }
  `,
})
export class LassoBasicsComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly options = [1, 1.5, 2];
  readonly modes = MODES;
  readonly mode = signal<Mode>('em');
  /** The unit the items are laid out in: em, except when the stage is drawn with a CSS transform. */
  readonly unit = computed(() => (this.mode() === 'transform' ? 'px' : 'em'));
  readonly scale = signal(1);
  readonly items = ITEMS;
  readonly selected = signal<string[]>([]);
  readonly commitSize = signal({ width: '-', height: '-' });

  /** Hit-tests the items against the committed rectangle, which is in viewport pixels. */
  onCommit(rect: LassoRect) {
    this.commitSize.set({
      width: (rect.right - rect.left).toFixed(1),
      height: (rect.bottom - rect.top).toFixed(1),
    });
    const hit = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('[data-item-id]')
    )
      .filter((el) => {
        const b = el.getBoundingClientRect();
        return (
          b.left < rect.right &&
          b.right > rect.left &&
          b.top < rect.bottom &&
          b.bottom > rect.top
        );
      })
      .map((el) => el.dataset['itemId'] as string);
    this.selected.set(hit);
  }
}
