import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { SelectOption, AutocompleteFieldConfig } from '../../models';
import { AbstractAutocompleteComponent } from '../../abstracts';

const defaultConfig: Partial<AutocompleteFieldConfig> = {
  autoActiveFirstOption: true,
  typeDebounceTime: 500
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

  setControlValue(initialValue: SelectOption) {
    if(initialValue) {
      // sets the initial value on the control if one is passed
      this.control.setValue(initialValue.value) // value.value :)
      this.autocompleteInputControl.setValue(initialValue.label);
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

  /**
   * To follow ARIA standards we want to select the active option on blur.
   * We do this by selecting the MatAutoCompleteTrigger, which triggers the select event
   * @param event blur event that triggers the handle blur, TODO: remove this parameter if not used by 7/4/19
   */
  handleTab(_event: FocusEvent) {
    if (this.autoInput.activeOption) {
      this.autoInput.activeOption.select();
      this.control.setValue(this.autoInput.activeOption.value);
    }
  }

}

