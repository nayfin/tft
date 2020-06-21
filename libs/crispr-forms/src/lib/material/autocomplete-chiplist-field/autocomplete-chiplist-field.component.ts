import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { AutocompleteChiplistFieldConfig, SelectOption } from '../../models';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { observablifyOptions } from '../../form.helpers';
import { switchMap, map, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

export const defaultAutocompleteChiplistConfig: Partial<AutocompleteChiplistFieldConfig> = {
  chipsSelectable: true,
  areChipsRemovable: true,
  addChipOnBlur: true,
  autoActiveFirstOption: true,
  imageUrlParam: 'image',
  typeDebounceTime: 500
}

@Component({
  selector: 'crispr-autocomplete-chiplist-field',
  templateUrl: './autocomplete-chiplist-field.component.html',
  styleUrls: ['./autocomplete-chiplist-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteChiplistFieldComponent implements OnInit {
  // This is stupid and annoying...
  // We need use ViewChild twice on the same template ref
  // - the MatAutocompleteTrigger is used to for selecting value on tab
  // - the ElementRef<HTMLInputElement> is used to clear the value from input element on selection
  @ViewChild('chipInput', { read: MatAutocompleteTrigger, static: false }) chipInput: MatAutocompleteTrigger;
  @ViewChild('chipInput', {static: false}) chipInputRef: ElementRef<HTMLInputElement>;
  private _config: AutocompleteChiplistFieldConfig
  set config(config: AutocompleteChiplistFieldConfig) {
    this._config = {...defaultAutocompleteChiplistConfig, ...config }
  }
  get config() {
    return this._config;
  }

  group: FormGroup;
  options$: Observable<SelectOption[]>;
  remainingOptions$: Observable<SelectOption[]>;
  chips$ = new BehaviorSubject<SelectOption[]>([]);

  controlValue$ = this.chips$.pipe(
    tap(chips => {
      this.control.setValue(chips.map(chip => chip.value))
    })
  );

  control: FormControl;
  // we need a separate control for the UI because of the way the material autocomplete chiplist works
  autocompleteInputControl = new FormControl('');

  constructor() { }

  ngOnInit() {
    this.group.addControl(this.config.controlName, new FormControl);
    this.control = this.group.get(this.config.controlName) as FormControl;

    this.options$ = this.autocompleteInputControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(this.config.typeDebounceTime  ),
      map(inputText => inputText || ''),
      switchMap(inputText => {
        return observablifyOptions(this.config.options, this.group, inputText, this.config.emptyOptionsMessage)
      })
    );

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
    // console.log({hello: this.config.value})
    // if (this.config.value) {
    //   this.chips$.next(this.config.value);
    // }
  }

  handleSelect(event: MatAutocompleteSelectedEvent) {
    const selectedOption: SelectOption = event.option.value as SelectOption;
    this.chips$.next([...this.chips$.value,  selectedOption]);
    this.chipInputRef.nativeElement.value = '';
    this.autocompleteInputControl.setValue('');
  }

    /**
   * To follow ARIA standards we want to select the active option on blur.
   * @param event blur event that triggers the handle blur, TODO: remove this parameter if not used by 7/4/19
   */
  handleTab(_event: FocusEvent ) {
    if (this.chipInput.activeOption) {
      this.chipInput.activeOption.select();
    }
  }

  mapToLabel(option: SelectOption) {
    return option ? option.label : '';
  }

  removeChip(removedChip: SelectOption) {
    const remainingChips: SelectOption[] = this.chips$.value.filter(chip => chip !== removedChip);
    this.chips$.next(remainingChips);
  }

  inputFilter(stringToCheck: string, searchString: string) {
    return stringToCheck.toLowerCase().includes(searchString.trim().toLowerCase());
  }
}
