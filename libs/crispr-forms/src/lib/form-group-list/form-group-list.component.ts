import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  WritableSignal,
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CrisprFieldDirective } from '../field.directive';
import { CrisprPipesModule } from '../pipes/crispr-pipes.module';
import { ReactiveFormsModule } from '@angular/forms';

import { FormValidationHandlerModule } from '@tft/form-validation-handler';
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
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    FieldContainerComponent,
    ReactiveFormsModule,
    CrisprFieldDirective,
    CrisprDisplayFieldDirective,
    CrisprPipesModule,
    FormValidationHandlerModule
],
})
export class FormGroupListComponent
  extends CrisprControlComponent<FormGroupListConfig>
  implements OnInit
{
  defaultConfig = defaultConfig;
  group: WritableSignal<FormGroup>;
  control: FormArray;
  /**
   * By setting this to true when adding/removing items from array,
   * we can block original values from overwriting form values
   * */
  blockValue = false;

  selectedIndex: number = null;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    // TODO: this is required to ngFor of controls in template, must be a better way
  }

  setControlValue(values: any[]) {
    if (this.control) {
      if (values?.length > 0) {
        // clear any existing values so that new values don't concatenate onto the old
        const currentValues: [] = this.control.value;
        if (currentValues.length) {
          this.control.clear();
        }
        values.forEach((value) => this.addGroup(value));
      } else if (this.config().displayInitialItem) {
        this.addGroup();
      }
      // needed to ensure new array items render
      setTimeout(() => {
        this.cdr.detectChanges();
      });
    }
  }

  clickDelete(index: number) {
    this.blockValue = true;
    this.deleteGroup(index);
  }

  clickAdd() {
    this.blockValue = true;
    this.addGroup();
  }

  addGroup(value = null) {
    this.control.push(createControlForType(this.config().itemConfig, value));
    // needed to ensure new array items render
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  deleteGroup(index: number) {
    this.control.removeAt(index);
  }

  clickEditItem(index: number) {
    this.selectedIndex = index;
  }
}
