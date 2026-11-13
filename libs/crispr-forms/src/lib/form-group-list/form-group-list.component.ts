import { Component, OnInit, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CrisprFieldDirective } from '../field.directive';
import { InitialControlValuePipe } from '../pipes/initial-control-value.pipe';
import { ReactiveFormsModule } from '@angular/forms';

import { ControlErrorContainerDirective } from '@tft/form-validation-handler';
import {
  createControlForType,
  FormGroupListConfig,
} from '../utils';
import { FieldContainerComponent } from '../ui';
import { CrisprDisplayFieldDirective } from '../display-field.directive';
import { CrisprControlComponent } from '../utils/abstracts/crispr-control.abstract';

const defaultConfig: Partial<FormGroupListConfig> = {
  addButtonLabel: 'ADD ITEM',
  minListLength: 1,
};

@Component({
    selector: 'crispr-form-group-list',
    templateUrl: './form-group-list.component.html',
    styleUrls: ['./form-group-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatIconModule,
        FieldContainerComponent,
        ReactiveFormsModule,
        CrisprFieldDirective,
        CrisprDisplayFieldDirective,
        InitialControlValuePipe,
        ControlErrorContainerDirective
    ],
    standalone: true
})
export class FormGroupListComponent
  extends CrisprControlComponent<FormGroupListConfig>
  implements OnInit
{
  defaultConfig = defaultConfig;
  /**
   * By setting this to true when adding/removing items from array,
   * we can block original values from overwriting form values
   * */
  readonly blockValue = signal(false);

  readonly selectedIndex = signal<number | null>(null);

  /** The item groups of the list's form array, typed for the template bindings. */
  readonly itemGroups = computed(() => (this.control() as FormArray<FormGroup> | null)?.controls);

  ngOnInit() {
    super.ngOnInit();
    // TODO: this is required to ngFor of controls in template, must be a better way
  }

  setControlValue(values: any[]) {
    const formArray = this.control() as FormArray;
    if (formArray) {
      if (values?.length > 0) {
        // clear any existing values so that new values don't concatenate onto the old
        const currentValues: [] = formArray.value;
        if (currentValues.length) {
          formArray.clear();
        }
        values.forEach((value) => this.addGroup(value));
      } else if (this.config().displayInitialItem) {
        this.addGroup();
      }
    }
  }

  clickDelete(index: number) {
    this.blockValue.set(true);
    this.deleteGroup(index);
  }

  clickAdd() {
    this.blockValue.set(true);
    this.addGroup();
  }

  addGroup(value = null) {
    const formArray = this.control() as FormArray;
    formArray.push(createControlForType(this.config().itemConfig, value));
  }

  deleteGroup(index: number) {
    const formArray = this.control() as FormArray;
    formArray.removeAt(index);
  }

  clickEditItem(index: number) {
    this.selectedIndex.set(index);
  }
}
