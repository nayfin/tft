/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Observable } from 'rxjs';

import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OptionComponent } from '../option';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { InfoComponent } from '../info';
import { FieldContainerComponent } from '../field-container';
import {
  observablifyOptions,
  SelectFieldConfig,
  SelectOption,
} from '../../utils';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

@Component({
  selector: 'crispr-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InfoComponent,
    OptionComponent,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    FieldContainerComponent,
    MatFormFieldModule,
  ],
})
export class SelectFieldComponent
  extends CrisprControlComponent<SelectFieldConfig>
  implements OnInit, AfterViewInit
{
  defaultConfig = {
    enableToggleAll: false,
    color: 'primary' as ThemePalette,
  };
  options$: Observable<SelectOption[]>;
  allSelected = false;

  @ViewChild('selectField') selectField: MatSelect;

  ngOnInit() {
    super.ngOnInit();
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config().options, this.group());
  }

  ngAfterViewInit() {
    if (
      this.config().multiple &&
      this.config().enableToggleAll &&
      this.selectField.options?.length === (this.value() as any[])?.length
    ) {
      this.allSelected = true;
    }
  }

  toggleAll(isSelected: boolean) {
    if (isSelected) {
      this.selectField.options.forEach((option) => option.deselect());
    } else {
      this.selectField.options.forEach((option) => option.select());
    }
    this.allSelected = !this.allSelected;
  }
}
