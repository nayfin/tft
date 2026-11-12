import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AccountForScaleDirective,
  ApplyScaleDirective,
  DraggableDirective,
  DragRootDirective,
  DropzoneDirective,
} from '@tft/interact';
import { Readout, readDrag } from '../../readout';

const START: Readout = { event: 'none', x: 40, y: 40 };

@Component({
  selector: 'tft-scale-basics',
  imports: [
    DraggableDirective,
    DropzoneDirective,
    DragRootDirective,
    AccountForScaleDirective,
    ApplyScaleDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../feature-page.scss',
  template: `
    <h1>Scale basics</h1>
    <p>
      When a stage is drawn larger or smaller than its layout units, pointer
      movement and interact units no longer match. Put <code>tftDragRoot</code>,
      <code>tftAccountForScale</code> and <code>tftApplyScale</code> on the
      stage with the same <code>scale</code>: <code>tftApplyScale</code> sets
      the font-size (so 1em is <code>scale</code> pixels) and
      <code>tftAccountForScale</code> makes <code>tftDraggable</code> divide
      pointer movement by the scale. At scale 1.5, moving the pointer 150px
      moves the item 100 units.
    </p>

    <section class="example">
      <div class="scale-options">
        @for (option of options; track option) {
        <button
          type="button"
          class="toggle"
          [attr.data-testid]="'scale-option-' + option"
          [attr.aria-pressed]="scale() === option"
          (click)="scale.set(option)"
        >
          {{ option }}
        </button>
        }
      </div>
      <div
        class="stage"
        tftDragRoot
        tftAccountForScale
        tftApplyScale
        [scale]="scale()"
        data-testid="scale-stage"
      >
        <div class="zone" tftDropzone data-testid="scale-zone">
          <div
            class="item"
            tftDraggable
            [x]="40"
            [y]="40"
            data-testid="scale-item"
            (dragStart)="
              position.set(readDrag('dragStart', $event, position()))
            "
            (dragMove)="position.set(readDrag('dragMove', $event, position()))"
            (dragEnd)="position.set(readDrag('dragEnd', $event, position()))"
          >
            <span class="label">Drag me</span>
          </div>
        </div>
      </div>
      <dl class="readout">
        <dt>Scale</dt>
        <dd data-testid="scale-value">{{ scale() }}</dd>
        <dt>Last event</dt>
        <dd data-testid="scale-event">{{ position().event }}</dd>
        <dt>Position (units)</dt>
        <dd>
          <span data-testid="scale-x">{{ position().x }}</span
          >,
          <span data-testid="scale-y">{{ position().y }}</span>
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
  `,
})
export class ScaleBasicsComponent {
  readonly options = [1, 1.5, 2];
  readonly scale = signal(1.5);
  readonly position = signal<Readout>(START);

  protected readonly readDrag = readDrag;
}
