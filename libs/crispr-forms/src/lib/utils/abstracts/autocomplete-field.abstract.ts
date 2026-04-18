import { computed, Directive, OnInit } from '@angular/core';
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
  // Narrows the parent's computed config type to include C-specific properties (e.g. chiplist-only fields)
  // Must re-implement the defaultConfig merge from CrisprFieldComponent because this override replaces it.
  config = computed(() => {
    const c = this.inputConfig() as (AutocompleteConfigTypes & C) | null;
    return (c && this.defaultConfig)
      ? { ...this.defaultConfig, ...c } as (AutocompleteConfigTypes & C)
      : c;
  });

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
