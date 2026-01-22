import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, Renderer2, SecurityContext, computed, effect, inject, signal, viewChild } from '@angular/core';
import { AutocompleteFieldConfig, ControlType, MapFieldConfig, TftMapMarker } from '../../utils';
import { GoogleMap, MapInfoWindow, MapMarker, MapGeocoder, MapAnchorPoint, } from '@angular/google-maps';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, map, merge, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe,  } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';
import { AutocompleteFieldComponent } from "../autocomplete-field/autocomplete-field.component";
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
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
  standalone: true,
  imports: [
    GoogleMap,
    MapInfoWindow, 
    MapMarker,
    ReactiveFormsModule, 
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    AsyncPipe, 
    AutocompleteFieldComponent, 
    FieldContainerComponent,
    MatButton,
    OverlayModule],
  templateUrl: './map-field.component.html',
  styleUrl: './map-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  fieldState = computed<'initiallyEmpty' | 'selecting' | 'selected'>(() => {
    if (this.mapOpen()) {
      return 'selecting';
    }
    return this.value() ? 'selected' : 'initiallyEmpty';
  });

  mapOpen = signal(false);
  mapComponent = viewChild(GoogleMap);
  defaultConfig = defaultConfig;

  locationControl = new FormControl(this.config()?.location);
  locationGroup = new FormGroup({
    location: this.locationControl,
  });
  
  location = toSignal<google.maps.places.AutocompleteSuggestion | null>(this.locationControl.valueChanges);

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

  constructor() {
    super();
    effect(() => {
      console.log('config.location', this.config().location);
      console.log('location', this.location());
      // this.config().location && this.locationControl.setValue(this.config().location);
    });
  }

  onMapInit(event: GoogleMap) {
    // console.log('map event', {event})
    this.currentMap.next(event);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onMarkerClick(marker: MapMarker) {
    const title = marker.getTitle();
    if (title) {
      this.control.setValue(title);
      this.closeMap();
    }
    // this.infoWindow().open(marker)
    this.config()?.onMarkerClick?.(marker);
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
    console.log('close click')
    // this.mapOpen.set(false);
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
