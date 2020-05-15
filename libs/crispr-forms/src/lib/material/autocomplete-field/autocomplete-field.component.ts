import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormGroup, AbstractControl } from '@angular/forms';
import { SelectOption, AutocompleteFieldConfig } from '../../models';

import { Observable } from 'rxjs';
import { switchMap, map, debounceTime, tap } from 'rxjs/operators';
import { observablifyOptions } from '../../form.helpers';

@Component({
  selector: 'crispr-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteFieldComponent implements OnInit {

  @ViewChild('autoInput', { read: MatAutocompleteTrigger, static: true }) autoInput: MatAutocompleteTrigger;

  config: AutocompleteFieldConfig;
  group: FormGroup;
  // options$: Observable<SelectOption[]>;
  filteredOptions$: Observable<SelectOption[]>;

  get control(): AbstractControl {
    return this.group.get(this.config.controlName);
  }

  get autoActiveFirstOption(): boolean {
    return this.config.autoActiveFirstOption === undefined
    ? true
    : this.config.autoActiveFirstOption;
  }

  constructor() { }

  ngOnInit() {
    // filter options by the search string using either the default filter function or one passed in through config
    this.filteredOptions$ = this.control.valueChanges.pipe(
      // this prevents errors when value changes is not a string because the filter function is expecting on
      debounceTime(this.config.typeDebounceTime || 500),
      map(searchText => searchText || ''),
      switchMap((searchText: string) => {
        return observablifyOptions(this.config.options, this.group, searchText)
      })
    );
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
      const correspondingOption = Array.isArray(options) ? options.find(option => option.value === value) : null;
      return correspondingOption ? correspondingOption.label : '';
    };
  }
  /**
   * To follow ARIA standards we want to select the active option on blur.
   * @param event blur event that triggers the handle blur, TODO: remove this parameter if not used by 7/4/19
   */
  handleTab(_event: FocusEvent) {
    if (this.autoInput.activeOption) {
      this.autoInput.activeOption.select();
      this.control.setValue(this.autoInput.activeOption.value);
    }
  }

}

