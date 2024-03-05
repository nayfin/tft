import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { tap, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeadingComponent } from '../heading';
// eslint-disable-next-line @nx/enforce-module-boundaries
import type { CrisprControlConfig } from '../../utils';

@Component({
  selector: 'crispr-field-container',
  templateUrl: './field-container.component.html',
  styleUrls: ['./field-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, HeadingComponent],
})
export class FieldContainerComponent implements OnInit, OnDestroy {
  // the configuration object for the field
  @Input() config: CrisprControlConfig;
  // the parent formGroup
  @Input() group: FormGroup;
  // boolean whether field-container is inline
  @Input() inlineField = false;
  // used to determine whether or not field should be shown
  disabled$: Observable<boolean>;

  subs: Subscription[] = [];

  ngOnInit() {
    this.disabled$ = this.connectDisabledCallback(this.group, this.config);
    // we tried moving this into afterViewChecked and afterContentChecked lifecycle hooks without any luck
    if (this.config.computeValue) {
      this.subs.push(
        this.config
          .computeValue(this.group)
          .pipe(
            distinctUntilChanged(),
            tap((computedValue) =>
              this.group.get(this.config.controlName).setValue(computedValue)
            )
          )
          .subscribe()
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe);
  }
  /**
   * Connects user defined disabledCallback function to the the view, so that the control is enabled/disabled
   * appropriately. It also will hide disabled fields in the UI unless `hideDisabled` is set to
   * false in the controls config
   * @param group used to get valueChanges from control
   * @param config configuration object used to
   */
  connectDisabledCallback(
    group: FormGroup,
    config: CrisprControlConfig = null
  ) {
    const control = group.get(config.controlName);
    // If the disabled$ function exists on the field config then call it with the disabledCallbackConfig
    // as a parameter otherwise return an observable of true.
    return config?.disabledCallback &&
      config.disabledCallback instanceof Function
      ? config.disabledCallback(group).pipe(
          // This enables/disables when callback conditions are met
          tap((shouldDisable) =>
            shouldDisable ? control.disable() : control.enable()
          )
        )
      : of(false);
  }
}
