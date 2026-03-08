import { ChangeDetectionStrategy, Component, OnInit, Renderer2, inject, signal, viewChild } from '@angular/core';
import { AutocompleteFieldConfig, ControlType, MapFieldConfig, TftMapMarker } from '../../utils';
import { GoogleMap, MapInfoWindow, MapMarker, MapGeocoder, } from '@angular/google-maps';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, map, merge, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe,  } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';
import { AutocompleteFieldComponent } from "../autocomplete-field/autocomplete-field.component";
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FieldContainerComponent } from '../field-container';
import { MatButton } from '@angular/material/button';

const defaultConfig: Partial<MapFieldConfig> = {
  debounceTime: 500,
};

interface MapState {  
  center: google.maps.LatLngLiteral;
  bounds: google.maps.LatLngBounds;
  zoom: number;
}

@Component({
    selector: 'crispr-map',
    imports: [
        GoogleMap,
        MapInfoWindow,
        MapMarker,
        ReactiveFormsModule,
        MatFormField,
        MatSelect,
        MatSelectTrigger,
        MatLabel,
        AsyncPipe,
        AutocompleteFieldComponent,
        FieldContainerComponent,
        MatButton,
        OverlayModule
    ],
    templateUrl: './map-field.component.html',
    styleUrl: './map-field.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
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
  private _preMapValue: any = null;
  private _selectionMade = false;

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
    options: async (group, searchTerm) => {
      // Add an initial request body.
      if (searchTerm) {
        return new Promise((resolve) => {
          console.log({searchTerm})
          const request: google.maps.places.AutocompleteRequest = {
            input: searchTerm,
            // locationRestriction: { west: -122.44, north: 37.8, east: -122.39, south: 37.78 },
            // origin: { lat: 37.7893, lng: -122.4039 },
            includedPrimaryTypes: [
              'postal_code', 
              'administrative_area_level_2', 
              'administrative_area_level_3',
              // 'locality',
              // 'sublocality',
            ],
            language: "en-US",
            region: "us",
            // sessionToken: token,
          };
          const options = google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
          .then((response) => response.suggestions.map(suggestion => {
            const option = {
              value: suggestion,
              label: suggestion.placePrediction.text.text
            }
            return option;
          }))
          resolve(options)
        })
      }
      return []
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
      const { geometry, postcode_localities, address_components } = res.results?.[0] || {};
      const { location, bounds } = geometry || {};
      const center = location?.toJSON();
      console.log({ center, bounds, postcode_localities, address_components });
      return center;
    }),
    startWith(this.config()?.center || undefined)
  )

  center = merge

  currentMap = new BehaviorSubject<GoogleMap | null>(null);
  displayValue = toSignal(this.control.valueChanges.pipe(map(value => this.displayValue(value))))
  currentMarkers = toSignal<TftMapMarker[]>(
    this.currentMap.pipe( 
      debounceTime(500),
      switchMap((map) => {
        return this.config()?.markers?.(map, this.group()) || of([]);
      }),
      // map((markers: TftMapMarker[]) => {  
      //   // return !this.config().markerTemplateBuilder ? markers 
      //   //   : markers.map((marker) => { 
      //   //     const content: HTMLElement = this.renderer.createElement('div');
      //   //     this.renderer.setProperty(content, 'innerHTML', this.domSanitizer.sanitize(SecurityContext.HTML, this.config().markerTemplateBuilder(marker)));
      //   //     this.config().markerClasses.forEach((className) => this.renderer.addClass(content, className));
      //   //     return { ...marker, content };
      //   // })
      // })
    )
  );


  onMapInit(event: GoogleMap) {
    // console.log('map event', {event})
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
    this._selectionMade = true;
    console.log({marker})
    // Set the control value to the marker's data object if it exists, otherwise fallback to the title
    const valueToSet = marker.value || marker.title;
    this.control.setValue(valueToSet);
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
    // store previous value and clear control for clean selection
    this._preMapValue = this.control.value;
    this.control.setValue(null);
    this._selectionMade = false;
    this.mapOpen.set(true);
  }
  closeMap() {
    // if map is closed without a selection, restore previous value
    if (!this._selectionMade && this._preMapValue) {
      this.control.setValue(this._preMapValue);
    }
    this._preMapValue = null;
    this.mapOpen.set(false);
  }

  getDisplay(value: any): string {
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    const displayKey = this.config()?.valueDisplayKey;
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
