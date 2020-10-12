import { Component, Inject, forwardRef, OnInit, Input } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectRefinementList } from 'instantsearch.js/es/connectors';
import { FilterListState, RefinementListItem } from '../models';

@Component({
  selector: 'mis-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent extends BaseWidget implements OnInit {

  @Input() title: string | null = 'Filter results';
  @Input() multiple = true;
  @Input() attributeName: string;

  state: FilterListState

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super('RefinementList');
  }

  public ngOnInit() {
    super.createWidget(connectRefinementList, { attributeName: this.attributeName });
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
