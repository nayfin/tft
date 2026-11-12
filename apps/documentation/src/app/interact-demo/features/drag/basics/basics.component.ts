import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ApplyScaleDirective,
  DraggableDirective,
  DragRootDirective,
  DropzoneDirective,
  TftDragEvent,
} from '@tft/interact';
import { Readout, toReadout } from '../../readout';

const START: Readout = { event: 'none', x: 40, y: 40 };

@Component({
  selector: 'tft-drag-basics',
  imports: [
    DraggableDirective,
    DropzoneDirective,
    DragRootDirective,
    ApplyScaleDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../feature-page.scss',
  template: `
    <h1>Drag basics</h1>
    <p>
      <code>tftDraggable</code> makes an element draggable. Put it inside a
      <code>tftDropzone</code> and the element keeps the position it is dropped
      at. While you drag, a clone of the element follows the pointer inside the
      nearest <code>tftDragRoot</code>.
    </p>

    <section class="example">
      <h2>Drag inside a dropzone</h2>
      <p>
        Inputs: <code>x</code>, <code>y</code> (starting position, in em).
        Outputs: <code>dragStart</code>, <code>dragMove</code>,
        <code>dragEnd</code>. The drag root swallows the click that browsers
        fire after a drop, so the click counter below only counts real clicks.
      </p>
      <div
        class="stage"
        tftDragRoot
        tftApplyScale
        [scale]="1"
        data-testid="basic-stage"
        (click)="rootClicks.set(rootClicks() + 1)"
      >
        <div class="zone" tftDropzone data-testid="basic-zone">
          <div
            class="item"
            tftDraggable
            [x]="40"
            [y]="40"
            data-testid="basic-item"
            (dragStart)="basic.set(read('dragStart', $event, basic()))"
            (dragMove)="basic.set(read('dragMove', $event, basic()))"
            (dragEnd)="basic.set(read('dragEnd', $event, basic()))"
          >
            <span class="label">Drag me</span>
          </div>
        </div>
      </div>
      <dl class="readout">
        <dt>Last event</dt>
        <dd data-testid="basic-event">{{ basic().event }}</dd>
        <dt>Position</dt>
        <dd>
          <span data-testid="basic-x">{{ basic().x }}</span
          >,
          <span data-testid="basic-y">{{ basic().y }}</span>
        </dd>
        <dt>Clicks on drag root</dt>
        <dd data-testid="basic-clicks">{{ rootClicks() }}</dd>
      </dl>
    </section>

    <section class="example">
      <h2>Drag from a handle</h2>
      <p>
        <code>dragConfig</code> takes any interactjs draggable option.
        <code>allowFrom: '.grip'</code> only starts a drag when the pointer goes
        down on the grip.
      </p>
      <div class="stage" tftDragRoot tftApplyScale [scale]="1">
        <div class="zone" tftDropzone data-testid="handle-zone">
          <div
            class="item"
            tftDraggable
            [x]="40"
            [y]="40"
            [dragConfig]="handleConfig"
            data-testid="handle-item"
            (dragStart)="handle.set(read('dragStart', $event, handle()))"
            (dragMove)="handle.set(read('dragMove', $event, handle()))"
            (dragEnd)="handle.set(read('dragEnd', $event, handle()))"
          >
            <span class="label">Body</span>
            <span class="grip" data-testid="handle-grip">Grip</span>
          </div>
        </div>
      </div>
      <dl class="readout">
        <dt>Last event</dt>
        <dd data-testid="handle-event">{{ handle().event }}</dd>
        <dt>Position</dt>
        <dd>
          <span data-testid="handle-x">{{ handle().x }}</span
          >,
          <span data-testid="handle-y">{{ handle().y }}</span>
        </dd>
      </dl>
    </section>

    <section class="example">
      <h2>Disable dragging</h2>
      <p>
        Bind <code>dragDisabled</code> to turn dragging off and on at runtime.
      </p>
      <div class="stage" tftDragRoot tftApplyScale [scale]="1">
        <div class="zone" tftDropzone data-testid="toggle-zone">
          <div
            class="item"
            tftDraggable
            [x]="40"
            [y]="40"
            [dragDisabled]="dragDisabled()"
            [class.disabled]="dragDisabled()"
            data-testid="toggle-item"
            (dragStart)="toggle.set(read('dragStart', $event, toggle()))"
            (dragMove)="toggle.set(read('dragMove', $event, toggle()))"
            (dragEnd)="toggle.set(read('dragEnd', $event, toggle()))"
          >
            <span class="label">{{
              dragDisabled() ? 'Locked' : 'Drag me'
            }}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="toggle"
        data-testid="toggle-drag-disabled"
        (click)="dragDisabled.set(!dragDisabled())"
      >
        {{ dragDisabled() ? 'Enable dragging' : 'Disable dragging' }}
      </button>
      <dl class="readout">
        <dt>dragDisabled</dt>
        <dd data-testid="toggle-disabled">{{ dragDisabled() }}</dd>
        <dt>Last event</dt>
        <dd data-testid="toggle-event">{{ toggle().event }}</dd>
        <dt>Position</dt>
        <dd>
          <span data-testid="toggle-x">{{ toggle().x }}</span
          >,
          <span data-testid="toggle-y">{{ toggle().y }}</span>
        </dd>
      </dl>
    </section>
  `,
  styles: `
    .grip {
      position: absolute;
      right: 0;
      top: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ff9800;
      font-size: 10px;
    }
  `,
})
export class DragBasicsComponent {
  readonly basic = signal<Readout>(START);
  readonly handle = signal<Readout>(START);
  readonly toggle = signal<Readout>(START);
  readonly dragDisabled = signal(false);
  readonly rootClicks = signal(0);

  readonly handleConfig = { allowFrom: '.grip' };

  read(event: string, e: TftDragEvent, previous: Readout): Readout {
    return toReadout(event, e.positionInDropTarget, previous);
  }
}
