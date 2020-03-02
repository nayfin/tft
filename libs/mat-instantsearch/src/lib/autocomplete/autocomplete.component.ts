import { Component, Inject, forwardRef, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectAutocomplete } from 'instantsearch.js/es/connectors';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { AlgoliaSearchHelper } from 'algoliasearch-helper';

@Component({
  selector: 'mis-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent extends BaseWidget implements OnInit {



  /*
  *
  *  IMPORTANT: if you want to use an image in the header of the list
  *  autocomplete returns list of search results as user types. but you shape the objects that get returned.
  *  so if you want to use an image from the items in that list, you can store its url in a parameter of those items
  *  but you have to tell us where to look
  *  if that object has a parameter for a url path to an image, then set imageUrlParam a string of the name of the
  *  e.g.
  *
  * in your algolia index if you have an index of objects that look like this:
  *   [
  *    {id: "q3lk4fk", name: "cold-turkey", **imageUrl** : "www.imagelibrary.com/the/location/of/my/image.png"},
  *    {id: "q33k4f4", name: "tomato", **imageUrl**: "www.imagelibrary.com/the/location/of/your/image.png"},
  *     ...
  *   ]
  *
  *  then you need to tell mis-autocomplete where to look, by passing it the parameter name as a string to the
  *  imageUrlParam input
  *
  *    <mis-autocomplete [imageUrlParam]="'imageUrl'"></mis-autocomplete>
  *
  *
  *
  */
  // will listen for changes on formControl then fire refine off with the controls value
  hits: Observable<any>;

  state: {
    query: '';
    refine: (value: string) => AlgoliaSearchHelper;
    indices: { hits: any[], index: string, label: string }[];
  };
  @Input() imageUrlParam = 'image';
  @Input() placeholder = 'Type to search';
  @Input() algoliaAttribution = true;
  @Input() selectTitle = 'SELECT';
  // Text inside of clear button
  @Input() clearTitle = 'CLEAR';
  @Input() debounceTime = 300;
  // Do you want to display clear button?
  @Input() displayClearButton = false;
  // Do you want to display the select button. MAKE SURE selectToSubmit IS NOT SET TO FALSE!!
  @Input() displaySelectButton = false;
  // Resets state of instantSearch's autocomplete mechanisms on submission of selected item
  @Input() clearOnSubmit = false;
  @Input() validators: Validators[] = [];
  @Input() autocompleteControl = new FormControl(null, ...this.validators);


  @Output() selectHit = new EventEmitter();



  constructor (
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent,
  ) {
    super('Autocomplete');
  }

  ngOnInit() {
    super.createWidget(connectAutocomplete);
    super.ngOnInit();
    console.log({control: this.autocompleteControl })
    this.hits = this.autocompleteControl.valueChanges.pipe(
      debounceTime(this.debounceTime),
      map(val =>  this.handleChange(val))
    );
  }

  @Input() displayWithFn: (val: any) => string  = (val) => {
    return val ? val.name : '';
  };

  @Input() mapHitsToOptions(hit: any) {
    return hit;
  };

  handleChange( query: string ): any[] {
    // this.autocompleteControl.setErrors({'valueSelected': false});
    const refinement: AlgoliaSearchHelper = this.state.refine(query);
    console.log({refinement})
    return refinement.lastResults.hits.map(this.mapHitsToOptions);
    // this.change.emit({query, hits});
  }

  handleSelect( event: MatAutocompleteSelectedEvent ) {
    const item = event.option.value;
    this.selectHit.emit({ item } );
    // if ( this.selectToSubmit) {
    //   this.handleSubmit();
    // }
  }

  handleSubmit(event: MouseEvent | KeyboardEvent) {
    // send submit event to parent component with selected item
    if ( event ) {
      event.preventDefault();
    }
    // this.submit.emit({ event, item : this.selected } );
    if ( this.clearOnSubmit ) {
      this.clearValue();
    }
  }

 handleClear(event: MouseEvent | KeyboardEvent) {
    // send reset event to parent component
    // this.reset.emit(event);
    // TODO: should be able to kill the following line, enable clear button and test
    this.state.refine('');
    this.clearValue();
  }

  clearValue() {
    this.autocompleteControl.reset();
  }

}
