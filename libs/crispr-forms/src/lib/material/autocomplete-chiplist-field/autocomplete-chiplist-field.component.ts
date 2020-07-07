import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';

import { AutocompleteChiplistFieldConfig, SelectOption } from '../../models';
import { AbstractAutocompleteComponent } from '../../abstracts';

const defaultConfig: Partial<AutocompleteChiplistFieldConfig> = {
  chipsSelectable: true,
  areChipsRemovable: true,
  addChipOnBlur: true,
  autoActiveFirstOption: true,
  imageUrlParam: 'image',
  typeDebounceTime: 500,
  allowDuplicates: false
}

@Component({
  selector: 'crispr-autocomplete-chiplist-field',
  templateUrl: './autocomplete-chiplist-field.component.html',
  styleUrls: ['./autocomplete-chiplist-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteChiplistFieldComponent
  extends AbstractAutocompleteComponent<AutocompleteChiplistFieldConfig> implements OnInit {
  // This is stupid and annoying...
  // We need use ViewChild twice on the same template ref
  // - the MatAutocompleteTrigger is used to for selecting value on tab
  // - the ElementRef<HTMLInputElement> is used to clear the value from input element on selection
  @ViewChild('autoInput', { read: MatAutocompleteTrigger }) chipInput: MatAutocompleteTrigger;
  @ViewChild('autoInput') chipInputRef: ElementRef<HTMLInputElement>;

  defaultConfig = defaultConfig;
  chips$ = new BehaviorSubject<SelectOption[]>([]);
  remainingOptions$: Observable<SelectOption[]>;

  controlValue$ = this.chips$.pipe(
    tap(chips => {
      this.control.setValue(chips.map(chip => chip.value))
    })
  );

  ngOnInit() {
    super.ngOnInit();
    this.remainingOptions$ = combineLatest([
      this.chips$,
      this.options$
    ]).pipe(
      map(([chips, options]) => {
        return this.config.allowDuplicates
        ? options
        : options.filter(option => {
          return !chips.some(chip => chip.value === option.value);
        })
      })
    )
  }

  setControlValue(value: SelectOption[]) {
    if (value) {
      this.chips$.next(value);
    }
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
  handleTab(_event: FocusEvent) {
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
