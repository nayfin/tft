import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AccountForScaleDirective,
  ApplyScaleDirective,
  DragRootDirective,
  ResizableDirective,
  TftResizeEvent,
} from '@tft/interact';

interface SizeReadout {
  event: string;
  width: number;
  height: number;
}

const START: SizeReadout = { event: 'none', width: 200, height: 120 };

@Component({
  selector: 'tft-resize-basics',
  imports: [
    ResizableDirective,
    DragRootDirective,
    AccountForScaleDirective,
    ApplyScaleDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../feature-page.scss',
  template: `
    <h1>Resize basics</h1>
    <p>
      <code>tftResizable</code> makes an element resizable from its edges.
      Inputs: <code>width</code> and <code>height</code> (starting size, in em),
      <code>resizeConfig</code> (any interactjs resizable option, here
      <code>edges: {{ '{' }} right: true, bottom: true {{ '}' }}</code
      >) and <code>resizeDisabled</code>. Outputs: <code>resizeStart</code>,
      <code>resizeMove</code>, <code>resizeEnd</code>, each with the new
      <code>size</code>. Inside a scaled area, put
      <code>tftAccountForScale</code> on an ancestor so sizes are reported in
      unscaled units.
    </p>

    <section class="example">
      <div
        class="stage"
        tftDragRoot
        tftAccountForScale
        tftApplyScale
        [scale]="1"
      >
        <div
          class="box"
          tftResizable
          [width]="200"
          [height]="120"
          [resizeConfig]="resizeConfig"
          [resizeDisabled]="resizeDisabled()"
          data-testid="resize-box"
          (resizeStart)="size.set(read('resizeStart', $event, size()))"
          (resizeMove)="size.set(read('resizeMove', $event, size()))"
          (resizeEnd)="size.set(read('resizeEnd', $event, size()))"
        >
          <span class="label">Resize me</span>
        </div>
      </div>
      <button
        type="button"
        class="toggle"
        data-testid="resize-toggle-disabled"
        (click)="resizeDisabled.set(!resizeDisabled())"
      >
        {{ resizeDisabled() ? 'Enable resizing' : 'Disable resizing' }}
      </button>
      <dl class="readout">
        <dt>resizeDisabled</dt>
        <dd data-testid="resize-disabled">{{ resizeDisabled() }}</dd>
        <dt>Last event</dt>
        <dd data-testid="resize-event">{{ size().event }}</dd>
        <dt>Size</dt>
        <dd>
          <span data-testid="resize-width">{{ size().width }}</span> x
          <span data-testid="resize-height">{{ size().height }}</span>
        </dd>
      </dl>
    </section>

    <section class="example">
      <h2>Without a scale ancestor</h2>
      <p>
        With no <code>tftAccountForScale</code> ancestor, the scale is 1 and
        sizes are reported as drawn.
      </p>
      <div class="stage" tftApplyScale [scale]="1">
        <div
          class="box"
          tftResizable
          [width]="200"
          [height]="120"
          [resizeConfig]="resizeConfig"
          data-testid="unscaled-box"
          (resizeEnd)="unscaled.set(read('resizeEnd', $event, unscaled()))"
        >
          <span class="label">Resize me</span>
        </div>
      </div>
      <dl class="readout">
        <dt>Last event</dt>
        <dd data-testid="unscaled-event">{{ unscaled().event }}</dd>
        <dt>Size</dt>
        <dd>
          <span data-testid="unscaled-width">{{ unscaled().width }}</span> x
          <span data-testid="unscaled-height">{{ unscaled().height }}</span>
        </dd>
      </dl>
    </section>
  `,
  styles: `
    .box {
      left: 40em;
      top: 40em;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #43a047;
      color: #fff;
      user-select: none;
    }
  `,
})
export class ResizeBasicsComponent {
  readonly size = signal<SizeReadout>(START);
  readonly resizeDisabled = signal(false);
  readonly unscaled = signal<SizeReadout>(START);

  readonly resizeConfig = { edges: { right: true, bottom: true } };

  read(event: string, e: TftResizeEvent, previous: SizeReadout): SizeReadout {
    return e.size
      ? {
          event,
          width: Math.round(e.size.width),
          height: Math.round(e.size.height),
        }
      : { ...previous, event };
  }
}
