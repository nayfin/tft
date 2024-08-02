import { Component, OnInit, inject, signal } from '@angular/core';
import { CrisprFieldComponent, MapFieldConfig, crisprControlMixin } from '../../utils';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker, MapGeocoder, } from '@angular/google-maps';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

const defaultConfig: Partial<MapFieldConfig> = {
  
};

const MapFieldMixin = crisprControlMixin<MapFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-map',
  standalone: true,
  imports: [GoogleMapsModule, ReactiveFormsModule, AsyncPipe ],
  templateUrl: './map-field.component.html',
  styleUrl: './map-field.component.scss',
})
export class MapFieldComponent
  extends MapFieldMixin
  implements OnInit
{
  geoCoder = inject(MapGeocoder);
  locationInput = new FormControl();

  defaultConfig = defaultConfig;
  markers = signal<google.maps.marker.AdvancedMarkerElementOptions[]>([])
  inputCenter = this.locationInput.valueChanges.pipe(
    switchMap((value: string) => {
      const request: google.maps.GeocoderRequest = {
        address: value,
      };
      return this.geoCoder.geocode(request);
    }),
    map((res) => {
      const { geometry, postcode_localities } = res.results?.[0] || {};
      const { location, bounds } = geometry || {};
      const center = location?.toJSON();
      console.log({ center, bounds, postcode_localities });
      return center;
    })
  )

  // center = new input
  ngOnInit() {
    super.ngOnInit();
    
  }

  onMarkerClick(marker: MapAdvancedMarker) {
    this.config?.onMarkerClick(marker);
  }

  onMove(map: GoogleMap, group: FormGroup) {
    console.log({map})
    this.config?.onMove?.(map, group);
  }

  getMarkers(map: GoogleMap, group: FormGroup) {
    this.config.markers(map, group).pipe()
  }
}