import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
@Component({
    selector: 'tft-control-error',
    templateUrl: './control-error.component.html',
    styleUrls: ['./control-error.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
 export class ControlErrorComponent {
  /** The error message to display. A falsy value hides the error. */
  readonly text = input<string | null | undefined>();

  /** Hidden until there is a message to show. */
  readonly hide = computed(() => !this.text());
}
