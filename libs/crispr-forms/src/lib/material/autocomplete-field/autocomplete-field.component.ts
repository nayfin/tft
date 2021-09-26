import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { SelectOption, AutocompleteFieldConfig, DEFAULT_EMPTY_OPTIONS_MESSAGE } from '../../models';
import { AbstractAutocompleteComponent } from '../../abstracts';

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
  implements OnInit {

  defaultConfig = defaultConfig;
  @ViewChild('autoInput', { read: MatAutocompleteTrigger }) autoInput: MatAutocompleteTrigger;
  @ViewChild('autoInput') autoInputRef: ElementRef<HTMLInputElement>;

  ngOnInit() {
    super.ngOnInit();
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
    return (value: any) => {
      return !!options && Array.isArray(options)
        ? options.find(option => option.value === value)?.label
        : value;
    };
  }

  handleSelect(event: MatAutocompleteSelectedEvent) {
    this.control.setValue(event.option.value)
    this.autoInputRef.nativeElement.blur();
  }
}

