import { OnInit, Directive } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';

import { crisprControlMixin } from './crispr-control.mixin';
import { AutocompleteFieldConfig, AutocompleteChiplistFieldConfig, SelectOption } from '../models';
import { CrisprFieldComponent } from './crispr-field.abstract';
import { observablifyOptions } from '../form.helpers';

type AutocompleteConfigTypes = AutocompleteFieldConfig | AutocompleteChiplistFieldConfig;

const AbstractAutocompleteFieldMixin = crisprControlMixin<AutocompleteConfigTypes>(CrisprFieldComponent);

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class AbstractAutocompleteComponent<C>
  extends AbstractAutocompleteFieldMixin implements OnInit {
  // we need a separate control for the UI because of the way the material autocomplete chiplist works
  autocompleteInputControl = new FormControl('');
  options$: Observable<SelectOption[]>
  config: AutocompleteConfigTypes & C;
  ngOnInit() {
    super.ngOnInit();

    this.group.addControl(this.config.controlName, new FormControl());
    // filter options by the search string using either the default filter function or one passed in through config
    this.options$ = this.autocompleteInputControl.valueChanges.pipe(
      // this is needed to have the options panel to open on focus
      startWith(''),
      debounceTime(this.config.typeDebounceTime),
      distinctUntilChanged(),
      map(searchText => searchText || ''),
      switchMap((searchText: string) => observablifyOptions(this.config.options, this.group, searchText, this.config.emptyOptionsMessage))
    );
  }
}
