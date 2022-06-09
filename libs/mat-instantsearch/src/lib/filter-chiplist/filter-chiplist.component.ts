import { Component, Inject, forwardRef, OnInit, Input } from '@angular/core';
import { Validators, UntypedFormControl } from '@angular/forms';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectRefinementList } from 'instantsearch.js/es/connectors';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RefinementListItem, RefinementListState } from '../models';
// import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'mis-filter-chiplist',
  templateUrl: './filter-chiplist.component.html',
  styleUrls: ['./filter-chiplist.component.scss']
})
export class FilterChiplistComponent extends BaseWidget implements OnInit {


  // attribute of search index to search and filter on
  @Input() attributeName: string;
  // or: results include any of the filter items | and: results include all of the filter items
  @Input() operator: 'or' | 'and' = 'or';
  // callback function to filter the attribute items as they are returned
  @Input() transformItems?: Function;
  // name of parameter on item holding image url path
  // e.g. if the item has a path to an image and it is located on item.imageUrl enter 'imageUrl'
  @Input() imageUrlParam = 'image';
  // placeholder for chiplist
  @Input() placeholder = 'Type to search';
  // any validators to pass into searchbox
  @Input() validators: Validators[] = [];
  // Text inside of clear button

  // Selecting item emits the submit event with the item's value
  @Input() areChipsRemovable = true;
  // Tab to select chip
  @Input() addChipOnBlur = true;

  // TODO: should we keep this around? What can it be used for?
  @Input() chipSelectable = true;

  // TODO: where is this limiting?
  @Input() limitMin: number | string = 10;
  @Input() limitMax: number | string;
  // TODO: what options do we get with sortBy?
  @Input() sortBy: string[] | ((item: object) => number);

  @Input() searchQuery = '';
  chips = [];

  autocompleteControl = new UntypedFormControl(null, ...this.validators);
  chips$ = new BehaviorSubject<RefinementListItem[]>([])
  remainingItems$: Observable<any[]>;

  state: RefinementListState = {
    canRefine: false,
    // canToggleShowMore: boolean;
    createURL: () => undefined,
    // isShowingMore: boolean;
    items: [],
    refine: () => undefined,
    searchForItems: () => undefined,
    isFormSearch: false,
  };

  constructor (
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent,
    ) {
    super('RefinementList');
  }

  ngOnInit() {

    super.createWidget(connectRefinementList, {
      limit: this.parseNumberInput(this.limitMin),
      showMoreLimit: this.parseNumberInput(this.limitMax),
      attributeName: this.attributeName,
      sortBy: this.sortBy,
      escapeFacetValues: true
    });
    super.ngOnInit();

    this.remainingItems$ = this.autocompleteControl.valueChanges.pipe(
      filter( (inputVal) => typeof inputVal === 'string' ),
      map( inputVal => {
        this.handleChange(inputVal);
        return this.state.items.filter( (item: any) => !item.isRefined);
      })
    );
  }

 refine(
    item: RefinementListItem,
  ) {
    if (this.state.canRefine) {
      // update UI directly, it will update the checkbox state
      item.isRefined = !item.isRefined;
      // refine through Algolia API
      this.state.refine(item.value);
    }
  }

  handleSubmit(event: MouseEvent) {
    event.preventDefault();
    this.state.searchForItems(this.searchQuery);
  }

  handleChange(value: string) {
    this.searchQuery = value;
    this.state.searchForItems(value);
  }

  handleSelect(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value
    this.refine(value);
    // this.chips.push(value);
    this.chips$.next([...this.chips$.value, value])
    this.searchQuery = '';
    // this.formContainer.get('autocomplete').reset();
  }

  removeChip(chip: RefinementListItem) {
    this.refine(chip);
    const currentChips = this.chips$.value;
    const splicedChips = currentChips.splice(currentChips.indexOf(chip), 1);
    this.chips$.next(splicedChips)
  }
  // TODO: this is used all over the place. Abstract it into a utils
  mapToName(val) {
    return val ? val.name : '';
  }
  // TODO: this needs to be abstracted
  parseNumberInput(input?: number | string) {
    return typeof input === 'string' ? parseInt(input, 10) : input;
  }

}
