/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { ENTER } from '@angular/cdk/keycodes';
import { FormGroup } from '@angular/forms';
import { ConnectionPositionPair, CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OptionComponent } from '../option';
import { MatIconModule } from '@angular/material/icon';
import {
  AutocompleteChiplistFieldConfig,
  AbstractAutocompleteComponent,
  DEFAULT_EMPTY_OPTIONS_MESSAGE,
  SelectOption,
  buildFormGroupFromConfig,
} from '../../utils';
import { FieldContainerComponent } from '../field-container';
import { InfoComponent } from '../info';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { CrisprFieldDirective } from '../../field.directive';

const defaultConfig: Partial<AutocompleteChiplistFieldConfig> = {
  chipsSelectable: true,
  areChipsRemovable: true,
  tabToSelect: true,
  autoActiveFirstOption: true,
  imageUrlParam: 'image',
  typeDebounceTime: 500,
  allowDuplicates: false,
  duplicateCompareFunction: (chip, option) => chip.value === option.value,
  separatorKeyCodes: [ENTER],
  emptyOptionsMessage: DEFAULT_EMPTY_OPTIONS_MESSAGE,
};

/** Sentinel used to detect "Create New" selection — never matches a real SelectOption */
const CREATE_NEW_SENTINEL: unique symbol = Symbol('CREATE_NEW');

@Component({
    selector: 'crispr-autocomplete-chiplist-field',
    templateUrl: './autocomplete-chiplist-field.component.html',
    styleUrls: ['./autocomplete-chiplist-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        InfoComponent,
        OptionComponent,
        ReactiveFormsModule,
        FieldContainerComponent,
        MatAutocompleteModule,
        MatInputModule,
        MatOptionModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        FormValidationHandlerModule,
        CdkConnectedOverlay,
        CdkOverlayOrigin,
        CrisprFieldDirective,
    ],
    standalone: true
})
export class AutocompleteChiplistFieldComponent
  extends AbstractAutocompleteComponent<AutocompleteChiplistFieldConfig>
  implements OnInit
{
  defaultConfig = defaultConfig;
  chips$ = new BehaviorSubject<SelectOption[]>([]);
  remainingOptions$: Observable<SelectOption[]>;
  selectedChip: SelectOption = null;
  controlValue$ = this.chips$.pipe(
    tap((chips) => {
      this.control().setValue(chips.map((chip) => chip.value));
    })
  );

  // We need use ViewChild twice on the same template ref to access as different types
  // - the MatAutocompleteTrigger is used to for selecting value on tab
  // - the ElementRef<HTMLInputElement> is used to clear the value from input element on selection
  @ViewChild('autoInput', { read: MatAutocompleteTrigger })
  chipInput: MatAutocompleteTrigger;
  @ViewChild('autoInput') chipInputRef: ElementRef<HTMLInputElement>;
  @ViewChild(CdkOverlayOrigin) overlayOrigin: CdkOverlayOrigin;

  readonly createNewSentinel = CREATE_NEW_SENTINEL;
  showCreateForm = signal(false);
  createFormGroup = new FormGroup({});

  readonly createFormPositions: ConnectionPositionPair[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top',    overlayX: 'start', overlayY: 'bottom' },
  ];

  get overlayWidth(): number {
    return this.overlayOrigin?.elementRef.nativeElement.offsetWidth ?? 0;
  }

  ngOnInit() {
    super.ngOnInit();
    this.remainingOptions$ = combineLatest([this.chips$, this.options$]).pipe(
      map(([chips, options]) => {
        return this.config().allowDuplicates
          ? options
          : options?.filter((option) => {
              return !chips.some((chip) =>
                this.config().duplicateCompareFunction(chip, option)
              );
            });
      })
    );
  }

  setControlValue(value: SelectOption[]) {
    if (value) {
      this.chips$.next(value);
    }
  }

  handleSelect(event: MatAutocompleteSelectedEvent) {
    if ((event.option.value as unknown) === CREATE_NEW_SENTINEL) {
      this.openCreateForm();
      return;
    }
    const selectedOption: SelectOption = event.option.value as SelectOption;
    this.chips$.next([...this.chips$.value, selectedOption]);
    this.chipInputRef.nativeElement.value = '';
    this.autocompleteInputControl.setValue('');
    // setTimeout needed because the panel thinks it's still open at this point
    setTimeout(() => this.chipInput.openPanel());
  }

  openCreateForm() {
    this.createFormGroup = buildFormGroupFromConfig({ fields: this.config().createChip!.fields });
    this.chipInputRef.nativeElement.value = '';
    this.autocompleteInputControl.setValue('');
    setTimeout(() => this.showCreateForm.set(true));
  }

  submitNewChip() {
    this.config().createChip!.submitChip(this.createFormGroup)
      .pipe(take(1))
      .subscribe((newChip) => {
        this.chips$.next([...this.chips$.value, newChip]);
        this.showCreateForm.set(false);
      });
  }

  closeCreateForm() {
    this.showCreateForm.set(false);
  }

  /**
   * To follow ARIA standards we want to select the active option on blur.
   * matChipInputAddOnBlur should do this but it causes buggy behaviour
   * @param event blur event that triggers the handle blur
   */
  handleTab(_event: FocusEvent) {
    if (
      this.chipInput.activeOption &&
      (this.config().tabToSelect || this.config().addChipOnBlur)
    ) {
      const chip = this.chipInput.activeOption.value;
      this.chips$.next([...this.chips$.value, chip]);
    }
  }

  /**
   * Handles selection via key tokens passed through separatorKeyCodes property
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
    if (!option || (option as unknown) === CREATE_NEW_SENTINEL) return '';
    return option.label ?? '';
  }

  removeChip(removedChip: SelectOption) {
    const remainingChips: SelectOption[] = this.chips$.value.filter(
      (chip) => chip !== removedChip
    );
    this.chips$.next(remainingChips);
  }

  highlightChip(chip: SelectOption) {
    if(this.config().chipsSelectable) {
      this.selectedChip = chip
    }
  }

  blurField() {
    this.selectedChip = null;
  }
}
