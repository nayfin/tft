import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  ApplyScaleDirective,
  DraggableDirective,
  DragRootDirective,
  DropzoneDirective,
  TftDropEvent,
} from '@tft/interact';

type ZoneId = 'a' | 'b';

interface Zone {
  id: ZoneId;
  name: string;
}

interface DropItem {
  id: string;
  zone: ZoneId;
  x: number;
  y: number;
}

interface LogEntry {
  n: number;
  text: string;
}

@Component({
  selector: 'tft-drag-dropzones',
  imports: [
    DraggableDirective,
    DropzoneDirective,
    DragRootDirective,
    ApplyScaleDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../feature-page.scss',
  template: `
    <h1>Dropzones</h1>
    <p>
      A <code>tftDropzone</code> reports what happens to draggables that are
      dragged over it. Inputs: <code>dropzoneData</code> (any value you want to
      get back in the events), <code>dropzoneId</code>. Outputs:
      <code>dragEnter</code>, <code>dragLeave</code>, <code>dragDrop</code>.
      Each event carries <code>positionInDropTarget</code> and
      <code>dropTarget</code>, so a drop handler can move the item to the new
      zone. Drag the item between the two zones.
    </p>

    <section class="example">
      <div
        class="stage"
        tftDragRoot
        tftApplyScale
        [scale]="1"
        data-testid="dz-stage"
      >
        @for (zone of zones; track zone.id) {
        <div
          class="zone"
          tftDropzone
          [dropzoneId]="'zone-' + zone.id"
          [dropzoneData]="zone"
          [attr.data-testid]="'zone-' + zone.id"
          (dragEnter)="record('dragEnter', zone, $event)"
          (dragLeave)="record('dragLeave', zone, $event)"
          (dragDrop)="onDrop(zone, $event)"
        >
          <span class="zone-title">{{ zone.name }}</span>
          @for (item of itemsByZone()[zone.id]; track item.id) {
          <div
            class="item"
            tftDraggable
            [x]="item.x"
            [y]="item.y"
            [dragData]="item"
            data-testid="dz-item"
          >
            <span class="label">{{ item.id }}</span>
          </div>
          }
        </div>
        }
      </div>
      <dl class="readout">
        <dt>Last event</dt>
        <dd data-testid="dz-last-event">{{ lastEvent() }}</dd>
        <dt>Items in Zone A</dt>
        <dd data-testid="dz-count-a">{{ itemsByZone().a.length }}</dd>
        <dt>Items in Zone B</dt>
        <dd data-testid="dz-count-b">{{ itemsByZone().b.length }}</dd>
        <dt>Dropped at</dt>
        <dd data-testid="dz-drop-position">{{ dropPosition() }}</dd>
      </dl>
      <h2>Event log</h2>
      <ol data-testid="dz-log">
        @for (entry of log(); track entry.n) {
        <li>{{ entry.text }}</li>
        }
      </ol>
    </section>
  `,
  styles: `
    .stage {
      display: flex;
      gap: 40em;
      width: 480em;
      height: 180em;
      background: transparent;
      outline: none;
    }
    .zone {
      width: 220em;
      height: 180em;
      flex: none;
      outline: 1px solid #90a4ae;
    }
    .zone-title {
      position: absolute;
      left: 6px;
      top: 4px;
      font-size: 12px;
      pointer-events: none;
      user-select: none;
    }
  `,
})
export class DragDropzonesComponent {
  readonly zones: Zone[] = [
    { id: 'a', name: 'Zone A' },
    { id: 'b', name: 'Zone B' },
  ];

  readonly items = signal<DropItem[]>([
    { id: 'item-1', zone: 'a', x: 40, y: 60 },
  ]);
  readonly log = signal<LogEntry[]>([]);
  readonly dropPosition = signal('none');

  readonly itemsByZone = computed(() => ({
    a: this.items().filter((item) => item.zone === 'a'),
    b: this.items().filter((item) => item.zone === 'b'),
  }));

  readonly lastEvent = computed(() => {
    const entries = this.log();
    return entries.length ? entries[entries.length - 1].text : 'none';
  });

  /**
   * Adds an entry to the event log. dragEnter and dragDrop read the zone's data from the event.
   * By the time dragLeave fires the library has already cleared `dropTarget`, so it uses the
   * zone that emitted the event.
   */
  record(
    event: 'dragEnter' | 'dragLeave' | 'dragDrop',
    zone: Zone,
    e: TftDropEvent
  ) {
    const zoneName =
      event === 'dragLeave'
        ? zone.name
        : e.dropTarget?.dropzoneData()?.name ?? 'unknown';
    this.log.update((entries) => [
      ...entries,
      { n: entries.length, text: `${event} ${zoneName}` },
    ]);
  }

  onDrop(zone: Zone, e: TftDropEvent) {
    this.record('dragDrop', zone, e);
    const item = e.dragRef.dragData() as DropItem;
    const position = e.positionInDropTarget;
    this.dropPosition.set(
      `${Math.round(position.x)}, ${Math.round(position.y)}`
    );
    if (item.zone !== zone.id) {
      this.items.update((items) =>
        items.map((i) =>
          i.id === item.id
            ? { ...i, zone: zone.id, x: position.x, y: position.y }
            : i
        )
      );
    }
  }
}
