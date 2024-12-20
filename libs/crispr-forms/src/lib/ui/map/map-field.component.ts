import { Component, OnInit, Renderer2, SecurityContext, inject, viewChild } from '@angular/core';
import { CrisprFieldComponent, MapFieldConfig, TftMapMarker, crisprControlMixin } from '../../utils';
import { GoogleMap, GoogleMapsModule, MapGeocoder, } from '@angular/google-maps';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, map, merge, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';

const defaultConfig: Partial<MapFieldConfig> = {
  debounceTime: 500,
};

const MapFieldMixin = crisprControlMixin<MapFieldConfig>(CrisprFieldComponent);

interface MapState {  
  center: google.maps.LatLngLiteral;
  bounds: google.maps.LatLngBounds;
  zoom: number;
}

@Component({
  selector: 'crispr-map',
  standalone: true,
  imports: [ GoogleMapsModule, ReactiveFormsModule, AsyncPipe, NgClass ],
  templateUrl: './map-field.component.html',
  styleUrl: './map-field.component.scss',
})
export class MapFieldComponent
  extends MapFieldMixin
  implements OnInit
{
  geoCoder = inject(MapGeocoder);
  renderer = inject(Renderer2);
  domSanitizer = inject(DomSanitizer);

  mapComponent = viewChild(GoogleMap);
  defaultConfig = defaultConfig;

  locationControl = new FormControl(this.config?.location);

  inputCenter = this.locationControl.valueChanges.pipe(
    switchMap((value: string) => {
      const request: google.maps.GeocoderRequest = {
        address: value,
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
    startWith(this.config?.center || undefined)
  )

  center = merge

  currentMap = new BehaviorSubject<GoogleMap | null>(null);

  currentMarkers = toSignal<TftMapMarker[]>(
    this.currentMap.pipe( 
      debounceTime(500),
      switchMap((map) => {
        return this.config?.markers?.(map, this.group) || of([]);
      }),
      map((markers: TftMapMarker[]) => {  
        return markers.map((marker) => { 
          if (this.config.markerTemplateBuilder) {
            const content: HTMLElement = this.renderer.createElement('div');
            this.renderer.setProperty(content, 'innerHTML', this.domSanitizer.sanitize(SecurityContext.HTML, this.config.markerTemplateBuilder(marker)));
            this.config.markerClasses.forEach((className) => this.renderer.addClass(content, className));
            return { ...marker, content };
          } else {
            return marker
          }
        });
      })
    )
  );

  constructor() {
    super();
  }

  onMapInit(event: GoogleMap) {
    // console.log('map event', {event})
    this.currentMap.next(event);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onMarkerClick(marker: TftMapMarker) {
    this.config?.onMarkerClick(marker);
  }

  onBoundsChanged(bounds: google.maps.LatLngBounds) {
    console.log({bounds});
  }

  onMove(map: GoogleMap, group: FormGroup) {
    this.config?.onMove?.(map, group);
    this.currentMap.next(map);
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

