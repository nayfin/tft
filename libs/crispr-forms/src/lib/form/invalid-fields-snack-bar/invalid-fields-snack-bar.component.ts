import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import type { InvalidField } from '../../utils';

/** What the form passes to the snack bar. */
export interface InvalidFieldsSnackBarData {
  fields: InvalidField[];
  /** The most fields to list, the rest are summed up as "+N more". */
  maxErrors: number;
  dismissLabel: string;
}

/**
 * The content of the snack bar a form opens after an invalid submit, listing the invalid fields.
 * Open it with `MatSnackBar.openFromComponent`. It does not move focus.
 */
@Component({
  selector: 'crispr-invalid-fields-snack-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  template: `
    <div matSnackBarLabel>
      <p class="heading">{{ heading() }}</p>
      <ul class="errors">
        @for (field of shownFields(); track field) {
        <li>
          <strong>{{ field.label }}</strong
          >: {{ field.message }}
        </li>
        }
      </ul>
      @if (hiddenCount() > 0) {
      <p class="more">+{{ hiddenCount() }} more</p>
      }
    </div>
    <div matSnackBarActions>
      <button type="button" mat-button matSnackBarAction (click)="dismiss()">
        {{ data.dismissLabel }}
      </button>
    </div>
  `,
  styles: [
    `
      .heading,
      .more {
        margin: 0;
      }
      .heading {
        font-weight: 500;
      }
      .errors {
        margin: 4px 0;
        padding-left: 20px;
      }
    `,
  ],
})
export class InvalidFieldsSnackBarComponent {
  protected readonly data =
    inject<InvalidFieldsSnackBarData>(MAT_SNACK_BAR_DATA);
  private readonly snackBarRef = inject(MatSnackBarRef);

  protected readonly heading = computed(() => {
    const count = this.data.fields.length;
    return `Fix ${count} ${count === 1 ? 'field' : 'fields'} to continue`;
  });
  protected readonly shownFields = computed(() =>
    this.data.fields.slice(0, this.data.maxErrors)
  );
  protected readonly hiddenCount = computed(
    () => this.data.fields.length - this.shownFields().length
  );

  protected dismiss() {
    this.snackBarRef.dismissWithAction();
  }
}
