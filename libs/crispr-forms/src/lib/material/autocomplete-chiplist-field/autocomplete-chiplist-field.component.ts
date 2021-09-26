import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { ENTER } from '@angular/cdk/keycodes';

import { AutocompleteChiplistFieldConfig, SelectOption } from '../../models';
import { AbstractAutocompleteComponent } from '../../abstracts';
import { MatChipInputEvent } from '@angular/material/chips';

const defaultConfig: Partial<AutocompleteChiplistFieldConfig> = {
  chipsSelectable: true,
  areChipsRemovable: true,
  addChipOnBlur: true,
  autoActiveFirstOption: false,
  imageUrlParam: 'image',
  typeDebounceTime: 500,
  allowDuplicates: false,
  separatorKeyCodes: [ENTER]
}

@Component({
  selector: 'crispr-autocomplete-chiplist-field',
  templateUrl: './autocomplete-chiplist-field.component.html',
  styleUrls: ['./autocomplete-chiplist-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteChiplistFieldComponent
  extends AbstractAutocompleteComponent<AutocompleteChiplistFieldConfig> implements OnInit {
  defaultConfig = defaultConfig;
  chips$ = new BehaviorSubject<SelectOption[]>([]);
  remainingOptions$: Observable<SelectOption[]>;

  controlValue$ = this.chips$.pipe(
    tap(chips => {
      this.control.setValue(chips.map(chip => chip.value))
    })
  );


  // We need use ViewChild twice on the same template ref to access as different types
  // - the MatAutocompleteTrigger is used to for selecting value on tab
  // - the ElementRef<HTMLInputElement> is used to clear the value from input element on selection
  @ViewChild('autoInput', { read: MatAutocompleteTrigger }) chipInput: MatAutocompleteTrigger;
  @ViewChild('autoInput') chipInputRef: ElementRef<HTMLInputElement>;


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

  // handles mat selecting
  handleSelect(event: MatAutocompleteSelectedEvent) {
    const selectedOption: SelectOption = event.option.value as SelectOption;
    this.chips$.next([...this.chips$.value,  selectedOption]);
    this.chipInputRef.nativeElement.value = '';
    this.autocompleteInputControl.setValue('');
    // setTimeout needed because the panel thinks it's still open at this point
    setTimeout(() => this.chipInput.openPanel())
  }

  /**
   * To follow ARIA standards we want to select the active option on blur.
   * matChipInputAddOnBlur should do this but it causes buggy behaviour
   * @param event blur event that triggers the handle blur
   */
  handleTab(_event: FocusEvent) {
    if (this.chipInput.activeOption && this.config.addChipOnBlur) {
      const chip = this.chipInput.activeOption.value;
      this.chips$.next([...this.chips$.value,  chip]);
    }
  }

  /**
   * Handles selection via key tokens passed through separatorKeyCodes propert
   * NOTE: If TAB is used focus does not move on to next component
   * @param event
   */
  handleTokenEnd(event: MatChipInputEvent) {
    if (this.chipInput.activeOption) {
      this.chipInput.activeOption.select();
    }
    event.chipInput?.clear();
  }

  mapToLabel(option: SelectOption) {
    return option ? option.label : '';
  }

  removeChip(removedChip: SelectOption) {
    const remainingChips: SelectOption[] = this.chips$.value.filter(chip => chip !== removedChip);
    this.chips$.next(remainingChips);
  }
}
