import { ChangeDetectionStrategy, Component, OnInit, Renderer2, computed, inject, signal, viewChild } from '@angular/core';
import { AutocompleteFieldConfig, ControlType, MapFieldConfig, TftMapMarker } from '../../utils';
import { GoogleMap, MapInfoWindow, MapMarker, MapGeocoder, } from '@angular/google-maps';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, map, merge, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe,  } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
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
export class MapFieldComponent
  extends CrisprControlComponent<MapFieldConfig>
  implements OnInit
{

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
  renderer = inject(Renderer2);
  domSanitizer = inject(DomSanitizer);
  
  infoWindow = viewChild(MapInfoWindow);
  selectedMarker = signal<TftMapMarker | null>(null);

  mapOpen = signal(false);
  mapComponent = viewChild(GoogleMap);
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

  center = merge

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


  onMapInit(event: GoogleMap) {
    this.currentMap.next(event);
  }
  ngOnInit() {
    super.ngOnInit();
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

  onBoundsChanged(bounds: google.maps.LatLngBounds) {
    console.log({bounds});
  }

  onMove(map: GoogleMap, group: FormGroup) {
    this.config()?.onMove?.(map, group);
    this.currentMap.next(map);
  }

  async onSelectLocation(suggestion: google.maps.places.AutocompletePrediction) { 
    if(!google.maps.places || !suggestion.place_id) return;
    const place = new google.maps.places.Place({id: suggestion.place_id })
    const location = await place.fetchFields({fields: ['location']});
    
    console.log({suggestion, location});
  }

  openMap() {
    this.mapOpen.set(true);
  }

  closeMap() {
    this.mapOpen.set(false);
  }

  getDisplay(value: any): string {
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    const displayKey = this.config()?.valueDisplayKey;
    console.log({value, displayKey, displayValue: value[displayKey]})
    if (displayKey && value[displayKey]) {
      return value[displayKey];
    }
    // Attempt to find a sensible display property
    return value.name || value.title || 'Selected Location';
  }
}


interface Station {
  location: {
    lat: number;
    lng: number;
  };
  selectedProbability: number;
  selectedFrostTemperature: number;
  averageLastFrostDate: string;
  averageFirstFrostDate: string;
  averageAnnualRainfall: number;

  hardinessZone: number;
}
