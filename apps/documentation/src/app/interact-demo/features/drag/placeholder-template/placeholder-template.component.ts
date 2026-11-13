import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ApplyScaleDirective,
  DraggableDirective,
  DragPreviewDirective,
  DragRootDirective,
  DropzoneDirective,
} from '@tft/interact';
import { Readout, readDrag } from '../../readout';

const START: Readout = { event: 'none', x: 40, y: 40 };

@Component({
  selector: 'tft-placeholder-template',
  imports: [
    DraggableDirective,
    DropzoneDirective,
    DragRootDirective,
    DragPreviewDirective,
    ApplyScaleDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../feature-page.scss',
  template: `
    <h1>Drag preview and placeholder</h1>
    <p>
      By default the clone of the element follows the pointer and the original
      is hidden. Add an
      <code>ng-template[tftDragPreview]</code> (here with
      <code>*tftDragPreview</code>) inside the draggable to drag different
      content instead. Set <code>showPlaceholder</code> to keep the original
      visible while the preview is dragged.
    </p>

    <section class="example">
      <h2>showPlaceholder off (default)</h2>
      <div
        class="stage"
        tftDragRoot
        tftApplyScale
        [scale]="1"
        data-testid="hidden-stage"
      >
        <div class="zone" tftDropzone data-testid="hidden-zone">
          <div
            class="item"
            tftDraggable
            [x]="40"
            [y]="40"
            data-testid="hidden-item"
            (dragStart)="hidden.set(readDrag('dragStart', $event, hidden()))"
            (dragMove)="hidden.set(readDrag('dragMove', $event, hidden()))"
            (dragEnd)="hidden.set(readDrag('dragEnd', $event, hidden()))"
          >
            <span class="label">Drag item</span>
            <div *tftDragPreview class="preview" data-testid="hidden-preview">
              <img src="assets/interact/drag-preview.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <dl class="readout">
        <dt>Last event</dt>
        <dd data-testid="hidden-event">{{ hidden().event }}</dd>
        <dt>Position</dt>
        <dd>
          <span data-testid="hidden-x">{{ hidden().x }}</span
          >,
          <span data-testid="hidden-y">{{ hidden().y }}</span>
        </dd>
      </dl>
    </section>

    <section class="example">
      <h2>showPlaceholder on</h2>
      <div
        class="stage"
        tftDragRoot
        tftApplyScale
        [scale]="1"
        data-testid="shown-stage"
      >
        <div class="zone" tftDropzone data-testid="shown-zone">
          <div
            class="item"
            tftDraggable
            [x]="40"
            [y]="40"
            [showPlaceholder]="true"
            data-testid="shown-item"
            (dragStart)="shown.set(readDrag('dragStart', $event, shown()))"
            (dragMove)="shown.set(readDrag('dragMove', $event, shown()))"
            (dragEnd)="shown.set(readDrag('dragEnd', $event, shown()))"
          >
            <span class="label">Drag item</span>
            <div *tftDragPreview class="preview" data-testid="shown-preview">
              <img src="assets/interact/drag-preview.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <dl class="readout">
        <dt>Last event</dt>
        <dd data-testid="shown-event">{{ shown().event }}</dd>
        <dt>Position</dt>
        <dd>
          <span data-testid="shown-x">{{ shown().x }}</span
          >,
          <span data-testid="shown-y">{{ shown().y }}</span>
        </dd>
      </dl>
    </section>
  `,
  styles: `
    .preview {
      width: 80em;
      height: 80em;
      background: #ffe0b2;
      img {
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
      }
    }
  `,
})
export class PlaceholderTemplateComponent {
  readonly hidden = signal<Readout>(START);
  readonly shown = signal<Readout>(START);

  protected readonly readDrag = readDrag;
}
