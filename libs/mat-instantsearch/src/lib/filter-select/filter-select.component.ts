import { Component, Inject, forwardRef, OnInit, Input, Optional } from '@angular/core';
import { NgAisIndex, NgAisInstantSearch, TypedBaseWidget } from 'angular-instantsearch';
import connectRefinementList, { RefinementListWidgetDescription, RefinementListConnectorParams  } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import { FilterListState, RefinementListItem } from '../models';

@Component({
  selector: 'mis-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent extends TypedBaseWidget<RefinementListWidgetDescription, RefinementListConnectorParams> implements OnInit {

  @Input() title: string | null = 'Filter results';
  @Input() multiple = true;
  @Input() attributeName: string;

  state: RefinementListWidgetDescription['renderState'] = {
    canRefine: false,
    // canToggleShowMore: boolean;
    createURL: () => undefined,
    // isShowingMore: boolean;
    items: [],
    refine: () => {},
    searchForItems: () => {},
    isFromSearch: false,
    hasExhaustiveItems: true,
    isShowingMore: false,
    sendEvent: () => {},
    canToggleShowMore: false,
    toggleShowMore: () => {}
  };

  constructor(
    @Inject(forwardRef(() => NgAisIndex))
    @Optional() public parentIndex: NgAisIndex,
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchInstance: NgAisInstantSearch
  ) {
    super('RefinementList');
  }

  public ngOnInit() {
    super.createWidget(connectRefinementList, { attribute: this.attributeName });
    super.ngOnInit();
  }

  public refine(
    event: MouseEvent,
    item: RefinementListItem
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (this.state.canRefine) {
      // if multi-select is deactivated clear refinements so that only last selected
      if (!this.multiple) {
        this.clearFilter();
      }
      // update UI directly, it will update the checkbox state
      item.isRefined = !item.isRefined;
      // refine through Algolia API
      this.state.refine(item.value);
    }
  }

  clearFilter() {
    this.state.items.forEach( (item, i, arr) => {
      if (item.isRefined === true) {
        item.isRefined = false;
        this.state.refine(item.value);
      }
    });
  }
}
