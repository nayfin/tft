import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormGroup, FormControl } from '@angular/forms';
import { SelectOption, AutocompleteFieldConfig } from '../../models';

import { Observable, Subject } from 'rxjs';
import { switchMap, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { observablifyOptions } from '../../form.helpers';

@Component({
  selector: 'crispr-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteFieldComponent implements OnInit {

  @ViewChild('autoInput', { read: MatAutocompleteTrigger }) autoInput: MatAutocompleteTrigger;
  @ViewChild('autoInput', {static: false}) autoInputRef: ElementRef<HTMLInputElement>;

  config: AutocompleteFieldConfig;
  group: FormGroup;
  autocompleteInputControl = new FormControl('');
  // options$: Observable<SelectOption[]>;
  filteredOptions$: Observable<SelectOption[]>
  selectedOption$ = new Subject<SelectOption>();

  control: FormControl;

  get autoActiveFirstOption(): boolean {
    return this.config.autoActiveFirstOption === undefined
    ? true
    : this.config.autoActiveFirstOption;
  }

  constructor() { }

  ngOnInit() {
    this.group.addControl(this.config.controlName, new FormControl());
    this.control = this.group.get(this.config.controlName) as FormControl;
    // filter options by the search string using either the default filter function or one passed in through config
    this.filteredOptions$ = this.autocompleteInputControl.valueChanges.pipe(
      // this prevents errors when value changes is not a string because the filter function is expecting on
      debounceTime(this.config.typeDebounceTime || 500),
      distinctUntilChanged(),
      map(searchText => searchText || ''),
      switchMap((searchText: string) => observablifyOptions(this.config.options, this.group, searchText, this.config.emptyOptionsMessage)),
    );
    if(this.config.value) {
      this.control.setValue(this.config.value);
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
    return (value: any) => Array.isArray(options) ? options.find(option => option.value === value)?.label : '';
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

