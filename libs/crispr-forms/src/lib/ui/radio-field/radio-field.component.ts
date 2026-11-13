/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { Observable } from 'rxjs';

import { MatRadioModule } from '@angular/material/radio';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlErrorsDirective } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import { RadioFieldConfig, SelectOption, observablifyOptions } from '../../utils';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

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
        ControlErrorsDirective
    ],
    standalone: true
})
export class RadioFieldComponent extends CrisprControlComponent<RadioFieldConfig> implements OnInit {
  defaultConfig = {};
  /** The radio group's control, typed for the `[formControl]` binding. */
  readonly radioControl = computed(() => this.control() as FormControl);
  options$: Observable<SelectOption[]>;
  ngOnInit() {
    super.ngOnInit();
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config().options, this.group());
  }
}
