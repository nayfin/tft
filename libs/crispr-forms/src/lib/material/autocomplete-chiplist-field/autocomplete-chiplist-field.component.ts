import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { AutocompleteChiplistFieldConfig, SelectOption } from '../../models';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { observablifyOptions } from '../../form.helpers';
import { switchMap, map, filter, shareReplay, tap, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export const defaultAutocompleteChiplistConfig: Partial<AutocompleteChiplistFieldConfig> = {
  chipsSelectable: true,
  areChipsRemovable: true,
  addChipOnBlur: true,
  imageUrlParam: 'image'
}

@Component({
  selector: 'crispr-autocomplete-chiplist-field',
  templateUrl: './autocomplete-chiplist-field.component.html',
  styleUrls: ['./autocomplete-chiplist-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteChiplistFieldComponent implements OnInit {

  private _config: AutocompleteChiplistFieldConfig
  set config(config: AutocompleteChiplistFieldConfig) {
    this._config = {...defaultAutocompleteChiplistConfig, ...config }
  }
  get config() {
    return this._config;
  }

  group: FormGroup;
  options$: Observable<SelectOption[]>;
  // options$: Observable<SelectOption[]>;
  remainingOptions$: Observable<SelectOption[]>;
  chips$ = new BehaviorSubject<SelectOption[]>([]);
  control: FormControl;
  // we need a separate control for the UI because of the way the material autocomplete chiplist works
  autocompleteInputControl: FormControl;
  @ViewChild('chipInput', {static: false}) chipInput: ElementRef<HTMLInputElement>
  constructor() { }

  ngOnInit() {
    this.group.addControl(this.config.controlName, new FormControl);
    this.control = this.group.get(this.config.controlName) as FormControl;
    this.autocompleteInputControl = new FormControl('');

    // this.options$ = observablifyOptions(this.config.options, this.group, this.config.emptyOptionsMessage).pipe(
    //   shareReplay(1)
    // );

    this.options$ = this.autocompleteInputControl.valueChanges.pipe(
      debounceTime(this.config.typeDebounceTime || 500),
      map(inputText => inputText || ''),
      filter(inputText => typeof inputText === 'string'),
      switchMap(inputText => {
        return observablifyOptions(this.config.options, this.group, inputText, this.config.emptyOptionsMessage);
      })
    )
    this.remainingOptions$ = combineLatest([
      this.chips$,
      this.options$
    ]).pipe(
      map(([chips, options]) => {
        return options.filter(option => {
          return !chips.some(chip => chip.value === option.value);
        })
      })
    )
    this.chips$.pipe(
      tap(chips => this.control.setValue(chips.map(chip => chip.value))),
    )
  }

  handleSelect(event: MatAutocompleteSelectedEvent) {
    const selectedOption: SelectOption = event.option.value as SelectOption;
    this.chips$.next([...this.chips$.value,  selectedOption]);
    this.chipInput.nativeElement.value = '';
    this.autocompleteInputControl.setValue('');
  }

  mapToLabel(option: SelectOption) {
    return option ? option.label : '';
  }

  removeChip(removedChip: SelectOption) {
    const remainingChips: SelectOption[] = this.chips$.value.filter(chip => chip !== removedChip)
    this.chips$.next(remainingChips);
  }

  inputFilter(stringToCheck: string, searchString: string) {
    return stringToCheck.toLowerCase().includes(searchString.trim().toLowerCase());
  }
}
