/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { Observable } from 'rxjs';

import { MatRadioModule } from '@angular/material/radio';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlErrorContainerDirective, ControlErrorsDirective } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import { RadioFieldConfig, SelectOption, observablifyOptions } from '../../utils';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

/** Gives each radio group's label a unique id, for `aria-labelledby`. */
let nextLabelId = 0;

@Component({
    selector: 'crispr-radio-field',
    templateUrl: './radio-field.component.html',
    styleUrls: ['./radio-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FieldContainerComponent,
        MatRadioModule,
        ControlErrorContainerDirective,
        ControlErrorsDirective
    ],
    standalone: true
})
export class RadioFieldComponent extends CrisprControlComponent<RadioFieldConfig> implements OnInit {
  defaultConfig = {};
  /** The radio group's control, typed for the `[formControl]` binding. */
  readonly radioControl = computed(() => this.control() as FormControl);
  options$: Observable<SelectOption[]>;
  /** The id of the visible label, which the group points to with `aria-labelledby`. */
  readonly labelId = `crispr-radio-label-${nextLabelId++}`;
  /** Names the group when there is no `label` to point at: the heading's text, so a heading-only radio is not unnamed. */
  readonly ariaLabel = computed(() => (this.config().label ? null : this.config().heading?.label ?? null));
  ngOnInit() {
    super.ngOnInit();
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config().options, this.group());
  }
}
