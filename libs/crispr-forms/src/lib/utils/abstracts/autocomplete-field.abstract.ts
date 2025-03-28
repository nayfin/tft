import { OnInit, Directive, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

import type { AutocompleteFieldConfig, AutocompleteChiplistFieldConfig, SelectOption } from '../models';
import { observablifyOptions } from '../functions';
import { CrisprControlComponent } from './crispr-control.abstract';

type AutocompleteConfigTypes = AutocompleteFieldConfig | AutocompleteChiplistFieldConfig;


@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class AbstractAutocompleteComponent<C>
  extends CrisprControlComponent<AutocompleteConfigTypes> implements OnInit {
  // we need a separate control for the UI because of the way the material autocomplete chiplist works
  autocompleteInputControl = new FormControl('');
  options$: Observable<SelectOption[]>
  config = signal<AutocompleteConfigTypes & C>(null);
  ngOnInit() {
    super.ngOnInit();

    this.group().addControl(this.config().controlName, new FormControl());
    // filter options by the search string using either the default filter function or one passed in through config()
    this.options$ = this.autocompleteInputControl.valueChanges.pipe(
      // this is needed to have the options panel to open on focus
      startWith(''),
      debounceTime(this.config().typeDebounceTime),
      map((searchText: string) => typeof searchText === 'string' ? searchText?.trim() : ''),
      distinctUntilChanged(),
      switchMap((searchText: string) => observablifyOptions(this.config().options, this.group(), searchText)),
      shareReplay(1),
    );
  }
}
