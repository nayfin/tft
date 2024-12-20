import { FormGroup } from "@angular/forms";
import { ControlType, CrisprControlConfig } from "./crispr-field.config";
import { GoogleMap } from "@angular/google-maps";
import { Observable } from "rxjs";

export type MapFieldConfig<OMCT = unknown, OMT = unknown> = CrisprControlConfig & {
  controlType: ControlType.MAP;
  label: string;
  center?: google.maps.LatLngLiteral;
  location?: string;
  options?: google.maps.MapOptions;
  debounceTime?: number;
  markers?: (map: GoogleMap, group: FormGroup) => Observable<TftMapMarker[]>;
  markerTemplateBuilder?: MarkerTemplateBuilder;
  markerClasses?: string[];
  onMove?: (map: GoogleMap, group: FormGroup) => OMT;
  onMarkerClick?: (marker: TftMapMarker) => OMCT;
}

export type TftMapMarker<DT = unknown> = google.maps.marker.AdvancedMarkerElementOptions & { data?: DT };
export type MarkerTemplateBuilder = (marker: TftMapMarker) => string;