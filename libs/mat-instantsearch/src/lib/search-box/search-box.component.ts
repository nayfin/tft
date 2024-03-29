import { Component, Inject, forwardRef, OnInit, Input, Optional } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseWidget, NgAisIndex, NgAisInstantSearch } from 'angular-instantsearch';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { AlgoliaAttributionComponent } from '../algolia-attribution/algolia-attribution.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mis-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    AlgoliaAttributionComponent,
    MatIconModule
  ]
})
export class MisSearchBoxComponent extends BaseWidget implements OnInit {

  @Input() public placeholder = 'Search';
  @Input() public submitTitle = 'Submit';
  @Input() public resetTitle = 'Reset';
  @Input() public algoliaAttribution = true;
  @Input() public displayResetButton = false;
  @Input() public refineOnKeyUp = true;

  state: {
    query: string;
    refine: (value: string) => void;
  };

  constructor(
    @Inject(forwardRef(() => NgAisIndex))
    @Optional() public parentIndex: NgAisIndex,
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchInstance: NgAisInstantSearch  ) {
    super('SearchBox');
  }

  public ngOnInit() {
    super.createWidget(connectSearchBox);
    super.ngOnInit();
  }

  public handleChange(query: string) {
    // this.change.emit(query);
    this.state.query = query;
    if (this.refineOnKeyUp) {
      this.state.refine(query);
    }
  }

  public handleSubmit(event: MouseEvent, query: string) {
    // send submit event to parent component
    // this.submit.emit(event);
    event.preventDefault();
    this.state.refine(query);

  }

  public handleReset(event: MouseEvent) {
    // send reset event to parent component
    // this.reset.emit(event);

    // reset search
    this.state.refine('');
  }
}
