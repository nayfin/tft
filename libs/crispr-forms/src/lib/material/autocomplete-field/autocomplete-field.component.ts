import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ElementRef, OnDestroy, NgModule } from '@angular/core';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';

import { SelectOption, AutocompleteFieldConfig, DEFAULT_EMPTY_OPTIONS_MESSAGE } from '../../models';
import { AbstractAutocompleteComponent } from '../../abstracts';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CrisprFieldModule } from '../../field.directive';
import { FieldContainerModule } from '../../field-container';
import { InfoModule } from '../info/info.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { OptionModule } from '../option';

const defaultConfig: Partial<AutocompleteFieldConfig> = {
  autoActiveFirstOption: true,
  typeDebounceTime: 500,
  emptyOptionsMessage: DEFAULT_EMPTY_OPTIONS_MESSAGE
};

@Component({
  selector: 'crispr-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteFieldComponent
  extends AbstractAutocompleteComponent<AutocompleteFieldConfig>
  implements OnInit, OnDestroy {

  defaultConfig = defaultConfig;
  @ViewChild('autoInput', { read: MatAutocompleteTrigger }) autoInput: MatAutocompleteTrigger;
  @ViewChild('autoInput') autoInputRef: ElementRef<HTMLInputElement>;

  clearFieldSubscription: Subscription;

  ngOnInit() {
    super.ngOnInit();
    this.clearFieldSubscription = this.autocompleteInputControl.valueChanges.subscribe((text: string) => {
      if (typeof text === 'string' && text?.trim() === '') {
        this.control.setValue(null);
      }
    })
  }

  ngOnDestroy() {
    this.clearFieldSubscription.unsubscribe();
  }

  setControlValue(value: SelectOption) {
    if(this.control && value) {
      // sets the initial value on the control if one is passed
      this.control.setValue(value.value || '');
      this.autocompleteInputControl.setValue(value.label || '');
    }
  }

  /**
   * The material autocomplete defaults to displaying the options value instead of its label.
   * We only have the value from the selected option to work with, so we have to pass the options
   * through a function called in the template and return the function that the material displayWith
   * input is expecting.
   * @param options the array of options to search for option with corresponding value
   */
  displayLabel(options: SelectOption[]) {
    if (this.config.displayWith) {
      return this.config.displayWith(options);
    }
    return (value: any) => {
      const label: string = !!options && Array.isArray(options)
      ? options.find((option) => JSON.stringify(option.value) === JSON.stringify(value))?.label: value;
      return label
    };
  }

  handleSelect(event: MatAutocompleteSelectedEvent) {
    this.control.setValue(event.option.value)
    this.autoInputRef.nativeElement.blur();
  }
}
@NgModule({
  imports: [
    CommonModule,
    InfoModule,
    OptionModule,
    ReactiveFormsModule,
    FieldContainerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
  ],
  exports: [
    AutocompleteFieldComponent
  ],
  declarations: [
    AutocompleteFieldComponent
  ]
})
export class AutocompleteFieldModule {
}
