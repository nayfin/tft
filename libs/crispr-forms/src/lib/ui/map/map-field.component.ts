import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { AutocompleteFieldConfig, ControlType, MapFieldConfig, TftMapMarker } from '../../utils';
import { GoogleMap, MapInfoWindow, MapMarker, MapGeocoder, } from '@angular/google-maps';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, map, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe,  } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';
import { AutocompleteFieldComponent } from "../autocomplete-field/autocomplete-field.component";
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FieldContainerComponent } from '../field-container';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

const defaultConfig: Partial<MapFieldConfig> = {
  debounceTime: 500,
};

@Component({
    selector: 'crispr-map',
    imports: [
        GoogleMap,
        MapInfoWindow,
        MapMarker,
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        AsyncPipe,
        AutocompleteFieldComponent,
        FieldContainerComponent,
        MatButton,
        OverlayModule
    ],
    templateUrl: './map-field.component.html',
    styleUrl: './map-field.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class MapFieldComponent extends CrisprControlComponent<MapFieldConfig> {

    /**
   * The overlay is positioned to align the top-right corner with the origin's bottom-right corner,
   * and the top-left corner with the origin's bottom-left corner.
   */
  overlayPositions: ConnectionPositionPair[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: -26
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    }
  ];
  geoCoder = inject(MapGeocoder);
  
  infoWindow = viewChild(MapInfoWindow);
  selectedMarker = signal<TftMapMarker | null>(null);

  mapOpen = signal(false);
  defaultConfig = defaultConfig;

  locationControl = new FormControl(this.config()?.location);
  locationGroup = new FormGroup({
    location: this.locationControl,
  });
  

  locationConfig: AutocompleteFieldConfig = {  
    controlType: ControlType.AUTOCOMPLETE,
    controlName: 'location',
    label: 'Location',
    placeholder: 'Enter a location',
    options: async (_group, searchTerm) => {
      if (searchTerm) {
        return new Promise((resolve) => {
          const request: google.maps.places.AutocompleteRequest = {
            includedPrimaryTypes: [
              'postal_code',
              'administrative_area_level_2',
              'administrative_area_level_3',
            ],
            language: "en-US",
            region: "us",
            ...this.config().searchAutocompleteRequest,
            input: searchTerm,
          };
          const options = google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
            .then((response) => response.suggestions.map(suggestion => ({
              value: suggestion,
              label: suggestion.placePrediction.text.text,
            })));
          resolve(options);
        });
      }
      return [];
    }
  }

  inputCenter = this.locationControl.valueChanges.pipe(
    filter(value => !!value && typeof value !== 'string'),
    switchMap((value: google.maps.places.AutocompleteSuggestion) => {

      const request: google.maps.GeocoderRequest = {
        address: value.placePrediction.text.text,
      };
      return this.geoCoder.geocode(request);
    }),
    map((res) => {
      const { geometry } = res.results?.[0] || {};
      const { location }= geometry || {};
      const center = location?.toJSON();
      return center;
    }),
    startWith(this.config()?.center || undefined)
  )

  currentMap = new BehaviorSubject<GoogleMap | null>(null);

  displayValue = toSignal(
    toObservable(this.control).pipe(
      switchMap(control => control
        ? control.valueChanges.pipe(startWith(control.value))
        : of('')
      ),
      map(value => this.getDisplay(value))
    )
  )  
  
  currentMarkers = toSignal<TftMapMarker[]>(
    this.currentMap.pipe( 
      debounceTime(500),
      switchMap((map) => {
        return this.config()?.markers?.(map, this.group()) || of([]);
      })
    )
  );


  /**
   * `mapInitialized` emits the native `google.maps.Map`, but `markers`/`onMove` are typed to receive the
   * `GoogleMap` component, so the template passes its `#map` ref instead.
   */
  onMapInit(map: GoogleMap) {
    this.currentMap.next(map);
  }

  onMarkerClick(clickedMarker: MapMarker) {
    const clickedPosition = clickedMarker.getPosition();
    if (!clickedPosition) return;
    // A simple title match is less prone to float precision issues than position
    const originalMarker = this.currentMarkers().find(m => m.title === clickedMarker.getTitle());

    if (originalMarker) {
      this.selectedMarker.set(originalMarker);
      this.infoWindow().open(clickedMarker);
    } 
  }

  selectMarker(marker: TftMapMarker) {
    const valueToSet = marker.value || marker.title;
    this.control().setValue(valueToSet);
    this.closeMap();
    this.infoWindow()?.close();
  }

  onMove(map: GoogleMap, group: FormGroup) {
    this.config()?.onMove?.(map, group);
    this.currentMap.next(map);
  }

  async onSelectLocation(suggestion: google.maps.places.AutocompletePrediction) { 
    if(!google.maps.places || !suggestion.place_id) return;
    const place = new google.maps.places.Place({id: suggestion.place_id })
    // TODO: the fetched location is not used yet, it should recenter the map on the selected suggestion
    await place.fetchFields({fields: ['location']});
  }

  openMap() {
    this.mapOpen.set(true);
  }

  closeMap() {
    this.mapOpen.set(false);
  }

  getDisplay(value: unknown): string {
    if (typeof value !== 'object' || value === null) {
      return value == null ? '' : String(value);
    }
    const record = value as Record<string, unknown>;
    const displayKey = this.config()?.valueDisplayKey;
    if (displayKey && record[displayKey]) {
      return String(record[displayKey]);
    }
    // Attempt to find a sensible display property
    return String(record['name'] || record['title'] || 'Selected Location');
  }
}
