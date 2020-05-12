import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { AutocompleteChiplistFieldConfig, SelectOption, OptionsType } from '../../models';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { observablifyOptions, connectReactiveOptionsToGroup } from '../../form.helpers';
// import { MatAutocompleteSelectedEvent } from '@angular/material';
import { switchMap, map, filter, shareReplay, distinctUntilChanged, tap } from 'rxjs/operators';
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
  filteredOptions$: Observable<SelectOption[]>;
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

    this.options$ = observablifyOptions(connectReactiveOptionsToGroup(this.config, this.group)).pipe(
      shareReplay(1)
    );
    this.remainingOptions$ = this.chips$.pipe(
      // shareReplay(1),
      tap(chips => this.control.setValue(chips.map(chip => chip.value))),
      switchMap(chips => {
        return this.options$.pipe(
          map(options => options.filter(option => !chips.includes(option)))
        );
      })
    )
    this.filteredOptions$ = this.autocompleteInputControl.valueChanges.pipe(
      map(inputText => inputText || ''),
      filter(inputText => typeof inputText === 'string'),
      // distinctUntilChanged(),
      switchMap(inputText => {
        return this.remainingOptions$.pipe(
          filter(remainingOptions => remainingOptions.length > 0 ),
          map(remainingOptions => remainingOptions.filter(remainingOption => {
            return this.inputFilter(remainingOption.label, inputText)
          }))
        )
      })
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
